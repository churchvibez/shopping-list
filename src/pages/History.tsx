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
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Grid from "@mui/material/Grid2";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ClearIcon from '@mui/icons-material/Clear';

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
    <div className="container mt-4" style={{ maxWidth: "60%", margin: "0 auto" }}>
      
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

      <Grid container direction="column" alignItems="center" sx={{ marginTop: "1%", padding: "0 10px" }}>
        {Object.values(historyLists).length > 0 ? (
          Object.values(historyLists).map((history) => (
            <Accordion 
              key={history.listKey} 
              sx={{ 
                width: "100%", 
                maxWidth: "890px", 
                marginBottom: "10px", 
                backgroundColor: "#FFFFFF",
                borderRadius: "0px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", 
                border: "1px solid #E0E3E7",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#ffffff",
                },
                "&:first-of-type": { 
                  borderTopLeftRadius: "0px", 
                  borderTopRightRadius: "0px", 
                }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />} 
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography sx={{ fontWeight: "600", fontSize: "1rem", color: "#0B1F33" }}>
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
                        primary={<Typography variant="body1" sx={{ fontWeight: "500", color: "#0B1F33" }}>{item.name}</Typography>} 
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
              backgroundColor: "#FFF3CD", 
              border: "1px solid #FFEBAA",
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

        <Box 
          sx={{ 
            position: "relative",
            width: "100%", 
            maxWidth: "900px", 
            minHeight: "80px",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleOpenConfirm}
            sx={{
              position: "absolute",
              bottom: 0, 
              right: 0,
              borderColor: "#D32F2F",
              color: "#D32F2F",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              "&:hover": {
                backgroundColor: "rgba(211, 47, 47, 0.1)",
                borderColor: "#B71C1C",
              },
              "&:active": {
                backgroundColor: "rgba(211, 47, 47, 0.2)",
              },
            }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: 18 }} /> Удалить
          </Button>
        </Box>
      </Grid>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            padding: "20px",
            width: "400px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "18px",
            fontWeight: "bold",
            padding: "12px 20px",
          }}
        >
          Очистить Историю
          <IconButton
            onClick={() => setConfirmOpen(false)}
            sx={{
              color: "#A6A6A6",
              "&:hover": { color: "#3C3C3C" },
            }}
          >
            <ClearIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: "8px 20px" }}>
          <Typography>Это очистит всю историю. Вы уверены, что хотите продолжить?</Typography>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "12px 20px",
          }}
        >
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            sx={{
              borderColor: "#C3C6CE",
              color: "#3C5099",
              backgroundColor: "#FFFFFF",
              textTransform: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              padding: "6px 16px",
              fontSize: "14px",
              "&:hover": {
                backgroundColor: "#F0F4FF",
                borderColor: "#3C5099",
              },
              "&:active": {
                backgroundColor: "#E0E8FF",
                borderColor: "#2A3D7F",
              },
              "&:focus-visible": {
                outline: "2px solid #87A4FF",
                outlineOffset: "2px",
              },
            }}
          >
            Отменить
          </Button>

          <Button
            onClick={handleClearHistory}
            variant="contained"
            sx={{
              backgroundColor: "#f04b65",
              color: "#FFFFFF",
              textTransform: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              padding: "6px 16px",
              fontSize: "14px",
              marginLeft: "8px",
              "&:hover": {
                backgroundColor: "#B71C1C",
              },
              "&:active": {
                backgroundColor: "#A62121",
              },
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default History;
