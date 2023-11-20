import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import FilterItem from "./FilterItem";
import { DateTimePicker } from "@mui/x-date-pickers";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";

function App() {
  const [searchText, setSearchText] = useState("");
  const [level, setLevel] = useState("");
  const [message, setMessage] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [traceId, setTraceId] = useState("");
  const [spanId, setSpanId] = useState("");
  const [commit, setCommit] = useState("");
  const [parentResourceId, setParentResourceId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [results, setResults] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [role, setRole] = useState(1);

  async function getData(pageDelta) {
    const page = pageDelta === 0 ? 1 : pageNumber + pageDelta;
    const result = await axios.post(
      `http://localhost:3000/logs/?page=${page}`,
      {
        searchText,
        level,
        message,
        resourceId,
        traceId,
        spanId,
        commit,
        parentResourceId,
        startDate,
        endDate,
      }
    );
    console.log(result);
    setResults(result.data.logs);
    setStartDate(null);
    setEndDate(null);
    setExpanded(false);
  }

  async function handleSearch(event) {
    event.preventDefault();

    setPageNumber(1);
    await getData(0);
  }

  return (
    <Container sx={{ marginTop: 3 }}>
      <Typography variant="h3" sx={{ marginBottom: "20px" }}>
        Querying Interface
      </Typography>
      <form>
        <TextField
          sx={{ width: "50%" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        ></TextField>
        <button className="btn" onClick={handleSearch}>
          Search
        </button>
      </form>
      <Accordion
        expanded={expanded}
        onChange={(val) => setExpanded(!expanded)}
        sx={{ width: "50%", marginTop: "20px", display: 'inline-block' }}
      >
        <AccordionSummary>
          <Typography>Filters</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: "flex", flexDirection: "column" }}>
          <FilterItem labelName="level" value={level} setValue={setLevel} />
          <FilterItem
            labelName="message"
            value={message}
            setValue={setMessage}
          />
          <FilterItem
            labelName="resourceId"
            value={resourceId}
            setValue={setResourceId}
          />
          <FilterItem
            labelName="traceId"
            value={traceId}
            setValue={setTraceId}
          />
          <FilterItem labelName="spanId" value={spanId} setValue={setSpanId} />
          <FilterItem labelName="commit" value={commit} setValue={setCommit} />
          <FilterItem
            labelName="parentResourceId"
            value={parentResourceId}
            setValue={setParentResourceId}
          />
          <DateTimePicker
            label="Start time"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
          />
          <DateTimePicker
            label="End time"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
          />
        </AccordionDetails>
      </Accordion>

      <Select value={role} onChange={(e) => setRole(e.target.value)} sx={{display: 'inline-block', marginLeft: '20px'}}>
        <MenuItem value={1}>Admin</MenuItem>
        <MenuItem value={2}>User</MenuItem>
      </Select>

      <TableContainer component={Paper} sx={{ marginTop: "100px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Level</TableCell>
              <TableCell align="center">Message</TableCell>
              <TableCell align="center">ResourceId</TableCell>
              <TableCell align="center">spanId</TableCell>
              {role === 1 && (
                <>
                  <TableCell align="center">traceId</TableCell>
                  <TableCell align="center">parentResourceId</TableCell>
                  <TableCell align="center">commit</TableCell>
                </>
              )}
              <TableCell align="center">timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result._id}>
                <TableCell>{result.level}</TableCell>
                <TableCell>{result.message}</TableCell>
                <TableCell>{result.resourceId}</TableCell>
                {role === 1 && (
                  <>
                    <TableCell>{result.spanId}</TableCell>
                    <TableCell>{result.traceId}</TableCell>
                    <TableCell>{result.metadata.parentResourceId}</TableCell>
                  </>
                )}
                <TableCell>{result.commit}</TableCell>
                <TableCell>{result.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {results.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Button
              disabled={pageNumber === 1}
              onClick={async () => {
                setPageNumber(pageNumber - 1);
                await getData(-1);
              }}
            >
              Prev
            </Button>
            <Typography>{pageNumber}</Typography>
            <Button
              disabled={results.length < 10}
              onClick={async () => {
                setPageNumber(pageNumber + 1);
                await getData(1);
              }}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}

export default App;
