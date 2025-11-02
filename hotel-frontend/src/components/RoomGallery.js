import React, { useState } from "react";

const RoomGallery = ({ images }) => {
    const [index, setIndex] = useState(0);

    if (!images || images.length === 0) {
        return <p>Фото кімнати недоступні.</p>;
    }

    const next = () => setIndex((index + 1) % images.length);
    const prev = () => setIndex((index - 1 + images.length) % images.length);

    return (
        <div className="gallery">
            <button onClick={prev}>◀</button>
            <img src={images[index]} alt="room" className="gallery-image" />
            <button onClick={next}>▶</button>
        </div>
    );
};

export default RoomGallery;
