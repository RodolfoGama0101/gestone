import React from 'react';
import './css/Testimonials.css';

const Testimonials: React.FC = () => {
    return (
        <section className="testimonials">
            <h2>O Que Nossos Usuários Dizem</h2>
            <div className='carousel'>
                <div className="divbox">
                    <p>"Este serviço transformou a maneira como eu gerencio meu dinheiro. Recomendo a todos!" - João Silva</p>
                </div>
                <div className="divbox">
                    <p>"Este serviço transformou a maneira como eu gerencio meu dinheiro. Recomendo a todos!" - João Silva</p>
                </div>
                <div className="divbox">
                    <p>"Este serviço transformou a maneira como eu gerencio meu dinheiro. Recomendo a todos!" - João Silva</p>
                </div>
                <div className="divbox">
                    <p>"Este serviço transformou a maneira como eu gerencio meu dinheiro. Recomendo a todos!" - João Silva</p>
                </div>
                <div className="divbox">
                    <p>"Este serviço transformou a maneira como eu gerencio meu dinheiro. Recomendo a todos!" - João Silva</p>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
