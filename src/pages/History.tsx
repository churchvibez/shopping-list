import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

// page for history of all transactions

const History: React.FC = () => {

  const historyList = useSelector((state: RootState) => state.history);

  return (
    <div className="container mt-4" style={{maxWidth: "1000px"}}>
    
      {/* historical total */}
      <Typography variant="h6" color="textSecondary"
        align="center"
        sx={{
          flexGrow: 1,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Общая сумма: ₽{historyList.totalSpent?.toFixed(2) || "0.00"}
      </Typography>

      {/* all historical transactions */}
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ marginTop: "3%" }}
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
      </Grid>
    </div>
  );
};

export default History;
