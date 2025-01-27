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
    <div className="container mt-4" style={{maxWidth: "90%", margin: "0 auto"}}>
    
      {/* historical total */}
      <Typography
        variant="h6"
        color="textSecondary"
        align="center"
        sx={{
          flexGrow: 1,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1rem",
          marginBottom: "15px",
        }}
      >
        Общая сумма: ₽{historyList.totalSpent?.toFixed(2) || "0.00"}
      </Typography>

      {/* all historical transactions */}
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{
          marginTop: "3%",
          padding: "0 10px",
        }}
      >
        <Grid>
          {historyList && historyList.items.length > 0 ? (
            <List
              className="custom-list"
              sx={{
                width: "100%",
                maxWidth: "400px",
                wordBreak: "break-word"
              }}
            >
              {historyList.items.slice().reverse().map((item, index) => (
                <ListItem
                  className="custom-list-item"
                  key={index}
                  sx={{
                    padding: "10px 0",
                  }}
                >
                  <ListItemIcon>
                    <FormatListBulletedOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        {item.name} - {item.amount} {item.indices} - ₽{item.totalPrice}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              variant="h6"
              color="textSecondary"
              align="center"
              sx={{
                marginTop: "20px",
                fontSize: "1rem",
                marginLeft: "0",
                transform: "none",
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
