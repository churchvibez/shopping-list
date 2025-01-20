import React from "react";

// component used for code abstraction in active + history
interface ListProps {
    items: string[];
    onRemove?: (item: string) => void;
}

const List: React.FC<ListProps> = ({ items, onRemove }) => {
    return(
        <ul className="custom-list">
            {items.map((item, index) => (
                <li key={index} className="custom-list-item">
                    <span>{item}</span>
                    {onRemove && (
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => onRemove(item)}
                        >
                            X
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default List;