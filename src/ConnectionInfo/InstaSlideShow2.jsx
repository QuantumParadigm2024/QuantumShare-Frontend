import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const InstaSlideShow2 = ({ images }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false 
    };

    return (
        <div className="slideshow">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className="slide">
                        <img src={image} alt={`slide-${index}`} className="slideshow-image" />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default InstaSlideShow2;