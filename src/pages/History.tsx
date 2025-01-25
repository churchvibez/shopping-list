import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import RubbishBinIcon from "../assets/rubbish-bin.svg";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { clearHistoryList } from "../store/store";

const History: React.FC = () => {
  const historyList = useSelector((state: RootState) => state.history);
  const dispatch = useDispatch<AppDispatch>();

  const handleClearHistory = () => {
    dispatch(clearHistoryList());
  };

  return (
    <><Typography variant="h6" color="textSecondary">
      Total: ₽{historyList.totalSpent?.toFixed(2) || "0.00"}
    </Typography><Grid
      container
      direction="column"
      alignItems="center"
      sx={{ marginTop: "1.2%", marginLeft: "10%" }}
    >
        <Grid
          size={{ md: 5 }}
        >
          {historyList && historyList.items.length > 0 ? (
            <List className="custom-list">
              {historyList.items.slice().reverse().map((item, index) => (
                <ListItem className="custom-list-item" key={index}>
                  <ListItemIcon>
                    <FormatListBulletedOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary={<Typography
                    sx={{}}
                  >
                    {item.name} - {item.amount} {item.indices} - ₽{item.totalPrice}
                  </Typography>} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{
                textAlign: 'center',
                marginLeft: '30%',
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
      </Grid></>
  );
};

export default History;
