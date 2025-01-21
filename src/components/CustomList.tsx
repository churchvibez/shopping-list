import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ListItemIcon from "@mui/material/ListItemIcon";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";

interface CustomListProps {
  items: string[];
  onDelete?: (item: string) => void;
  onAdd?: (item: string) => void;
  isAddable?: boolean;
  disabledItems?: string[]; // Array of items to disable
}

const CustomList: React.FC<CustomListProps> = ({
  items,
  onDelete,
  onAdd,
  isAddable = false,
  disabledItems = [],
}) => {
  return (
    <List className="custom-list">
      {items.map((item) => (
        <ListItem
          key={item}
          className="custom-list-item"
          secondaryAction={
            <>
              {onAdd && isAddable && (
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => onAdd(item)}
                  disabled={disabledItems.includes(item)} // Disable based on the condition
                >
                  <AddIcon />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => onDelete(item)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </>
          }
        >
          <ListItemIcon>
            <FormatListBulletedOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );
};

export default CustomList;
