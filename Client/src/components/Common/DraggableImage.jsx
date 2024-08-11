// Client/src/components/Common/DraggableImage.jsx
import React from 'react';
import { Draggable } from 'react-draggable';

const DraggableImage = ({ src, alt, className }) => {
  return (
    <Draggable>
      <img src={src} alt={alt} className={className} style={{ cursor: 'move' }} />
    </Draggable>
  );
};

export default DraggableImage; // Ensure this is a default export