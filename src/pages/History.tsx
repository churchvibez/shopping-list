import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { clearHistory } from "../store/store";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import RubbishBinIcon from "../assets/rubbish-bin.svg";

const History: React.FC = () => {
  const historyList = useSelector((state: RootState) => state.history);
  const dispatch = useDispatch<AppDispatch>();

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  return (
    <Grid 
      container 
      direction="column" 
      alignItems="center" 
      sx={{ marginTop: "1.2%" }}
    >
      <Grid 
        size={{ xs: 5, md: 4}}
        sx= {{
          marginLeft: '7%',
        }}
      >
        {historyList.length > 0 ? (
          <List className="custom-list">
            {historyList.map((item, index) => (
              <ListItem className="custom-list-item" key={index}>
                <ListItemIcon>
                      <FormatListBulletedOutlinedIcon />
                  </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{
              textAlign: 'center',
              marginLeft: '15%',
              transform: 'translateX(-20.5%)',
            }}
          >
            Нет истории
          </Typography>
        )}
      </Grid>
      <Grid>
      <Button onClick={handleClearHistory}>
        <img src={RubbishBinIcon} alt="Очистить" style={{ width: '25px', height: '25px' }} />
      </Button>
      </Grid>
    </Grid>
  );
};

export default History;
