import { Box, TextField, Typography } from "@mui/material";

function FilterItem({labelName, value, setValue}) {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
      <Typography sx={{width: '30%'}}>{labelName}</Typography>
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        size="small"
        sx={{marginLeft:'15px'}}
      ></TextField>
    </Box>
  );
}

export default FilterItem;
