import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ListItemIcon from "@mui/material/ListItemIcon";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import { Item } from "../store/store";
import { Typography } from "@mui/material";

interface CustomListProps {
  items: Item[];
  onDelete?: (item: string) => void;
  onAdd?: (item: string) => void;
  isAddable?: boolean;
  disabledItems?: string[];
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
          key={item.name}
          className="custom-list-item"
          secondaryAction={
            <>
              {onAdd && isAddable && (
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => onAdd(item.name)}
                  disabled={disabledItems.includes(item.name)}
                >
                  <AddIcon />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => onDelete(item.name)}
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
            <Typography
                noWrap
                sx = {{
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipses',
                  whiteSpace: 'nowrap',
                }}
            >
                {item.name} - {item.amount} {item.indices}
            </Typography>
        </ListItem>
      ))}
    </List>
  );
};

export default CustomList;
