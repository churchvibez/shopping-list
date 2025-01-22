import React from "react";
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/main.scss';

// component used for code abstraction in active + history
interface ListProps {
    items: string[];
    onRemove?: (item: string) => void;
}

const ComponentList: React.FC<ListProps> = ({ items, onRemove }) => {
    return(
        <ul className="custom-list">
            {items.map((item, index) => (
                <li key={index} className="custom-list-item">
                    <span>{item}</span>
                    {onRemove && (
                        <Button
                            variant="contained"
                            color="error"
                            className="btn btn-sm btn-danger"
                            onClick={() => onRemove(item)}
                        >
                            <CloseIcon/>
                        </Button>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default ComponentList;