const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");

const Log = require("./models/Log");
const { log } = require("async");

const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const logData = req.body;
  try {
    const newLog = await Log.create(logData);
    res.status(200).json({ message: "Log ingested successfully", log: newLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/logs", async (req, res) => {
  try {
    //   // Extract user input from the query parameters
    let {
      searchText,
      level,
      message,
      resourceId,
      traceId,
      spanId,
      commit,
      startDate,
      endDate,
      parentResourceId,
    } = req.body;

    let {page} = req.query;
    if (!page) page = 1;
    if(page<1){
        res.status(400).json({
            error: "Invalid page number"
        })
        return;
    }

    const pipeline = [];

    pipeline.push({
      $search: {
        index: "logsSearch",
        compound: {
          must: [],
        },
      },
    });
    pipeline.push({
      $project: {
        __v: 0,
        // score: {$meta: 'searchScore'}
      },
    });
    const optionsArray = pipeline[0].$search.compound.must;
    if (searchText && searchText.length > 2)
      optionsArray.push({
        text: { query: searchText, path: { wildcard: "*" }, fuzzy: {} },
      });

    function generateQuery(field, fieldName) {
        if (field && field.length > 0)
      optionsArray.push({ text: { query: field, path: fieldName } });
    }

    generateQuery(level, 'level');
    generateQuery(message, 'message');
    generateQuery(resourceId, 'resourceId');
    generateQuery(traceId, 'traceId');
    generateQuery(spanId, 'spanId');
    generateQuery(commit, 'commit');
    generateQuery(parentResourceId, 'metadata.parentResourceId');

    if (startDate && startDate.length > 0 && endDate && endDate.length > 0) {
      pipeline.push({
        $match: {
          timestamp: { $lte: new Date(endDate), $gte: new Date(startDate) },
        },
      });
    }

    if (optionsArray.length === 0) {
      res.status(200).json({
        message: "No search criteria",
        logs: [],
      });
      return;
    }

    // Performing the query
    const logs = await Log.aggregate(pipeline)
      // .sort({score: -1})
      .skip((page - 1) * 10)
      .limit(10);

    console.log("1");

    // Respond with the queried logs
    res.json({
      message: "Queried logs",
      logs,
    });
  } catch (error) {
    console.log("2");

    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
