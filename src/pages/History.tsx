import RubbishBinIcon from "../assets/rubbish-bin.svg";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { clearHistoryList } from "../store/store";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Grid from "@mui/material/Grid2";

const History: React.FC = () => {
  const historyLists = useSelector((state: RootState) => state.history.lists);
  const dispatch = useDispatch<AppDispatch>();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClearHistory = () => {
    dispatch(clearHistoryList());
    setConfirmOpen(false);
  };

  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "90%", margin: "0 auto" }}>
      
      <Button
        startIcon={<ArrowBackIcon />}
        sx={{
          backgroundColor: "transparent",
          color: "#3057D5",
          textTransform: "none",
          "&:hover": { textDecoration: "underline" },
        }}
        onClick={() => window.history.back()}
      >
        Назад
      </Button>

      <Grid container direction="column" alignItems="center" sx={{ marginTop: "3%", padding: "0 10px" }}>
        
        {Object.values(historyLists).length > 0 ? (
          Object.values(historyLists).map((history) => (
            <Accordion 
              key={history.listKey} 
              sx={{ 
                width: "100%", 
                maxWidth: "600px", 
                marginBottom: "10px", 
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                boxShadow: "none",
                border: "1px solid #d1d1d1",
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />} 
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "1rem", color: "#0b1f33" }}>
                  {history.listName}
                </Typography>
                <Typography color="textSecondary" sx={{ marginLeft: "auto", fontWeight: "500" }}>
                  Общая сумма: ₽{history.total.toFixed(2)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {history.purchases.map((item, idx) => (
                    <ListItem key={idx} sx={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                      <ListItemText 
                        primary={<Typography variant="body1" sx={{ fontWeight: "500", color: "#0b1f33" }}>{item.name}</Typography>} 
                      />
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="textSecondary">
                            {item.amount} {item.indices} - ₽{item.totalPrice.toFixed(2)}
                          </Typography>
                        }
                        sx={{ textAlign: "right" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Box 
            sx={{ 
              marginTop: "20px", 
              padding: "20px", 
              backgroundColor: "#fff3cd", 
              border: "1px solid #ffeeba",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "600px"
            }}
          >
            <Typography 
              variant="h6" 
              align="center" 
              sx={{ fontSize: "1rem", fontWeight: "bold", color: "#856404" }}
            >
              Нет истории
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: "#856404" }}>
              Вы еще не совершали покупок.
            </Typography>
          </Box>
        )}

        <Button 
          onClick={handleOpenConfirm} 
          sx={{ 
            marginTop: "20px", 
            backgroundColor: "#D32F2F", 
            color: "#fff",
            "&:hover": { backgroundColor: "#B71C1C" },
            padding: "10px 20px",
            borderRadius: "8px",
            textTransform: "none"
          }}
        >
          <img src={RubbishBinIcon} alt="Очистить" style={{ width: '20px', height: '20px', marginRight: "10px" }} />
          Очистить Историю
        </Button>
      </Grid>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ display: "flex", justifyContent: "center", gap: "5px", width: "100%" }}>
          Очистить Историю
        </DialogTitle>
        <DialogContent>
          <Typography>Это очистит всю историю. Вы уверены, что хотите продолжить?</Typography>
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "5px", width: "100%" }}>
            <Button
              onClick={handleClearHistory}
              variant="contained"
              sx={{
                backgroundColor: "#3057D5",
                "&:hover": { backgroundColor: "#1E3C92" },
                textTransform: "none"
              }}
            >
              Удалить
            </Button>
            <Button
              onClick={() => setConfirmOpen(false)}
              variant="contained"
              sx={{
                backgroundColor: "#D32F2F",
                "&:hover": { backgroundColor: "#B71C1C" },
                textTransform: "none"
              }}
            >
              Отменить
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default History;
