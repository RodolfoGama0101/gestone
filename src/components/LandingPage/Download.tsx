import React from 'react';
import './css/Download.css';

const Download: React.FC = () => {
    return (
        <section className='download'>
            <h1 className='title-download'>Baixe aqui!!</h1>
            <a href='teste.apk' download>
                <button className="btn-download" role="button">
                    Gestone
                </button>
            </a>
        </section>
    );
};

export default Download;
