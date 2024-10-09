import React from 'react';
import './css/Benefits.css';

const Benefits: React.FC = () => {
    return (
        <section className="benefits">
            <h2>Benefícios</h2>

            <iframe 
                src="https://www.youtube.com/embed/p09i_hoFdd0" 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{ width: "100%", height: "400px", border: "none" }} /* Custom style */
            />
        </section>
    );
};

export default Benefits;
