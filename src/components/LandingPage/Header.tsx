import React, { useState, useRef } from 'react';
import './css/Header.css';

const Header: React.FC = () => {

    const [isActive, setIsActive] = useState(false);

    const navMenuRef = useRef(null);
    const menuRef = useRef(null);

    const handleMenuClick = () => {
        setIsActive(!isActive);

    };

    return (
        <header className="header">

            <nav className="navigation">
                <a href="#" className="logo">Gestone</a>
                <ul ref={navMenuRef} className={`nav-menu ${isActive ? 'ativo' : ''}`}>
                    <li className="nav-item"><a href="Cadastro">Cadastro</a></li>
                    <li className="nav-item"><a href="Login">Login</a></li>
                    <li className="nav-item"><a href="paginasobre">Sobre</a></li>
                    <li className="nav-item"><a href="Suporte">Support</a></li>

                </ul>
                <div ref={menuRef} className={`menu ${isActive ? 'ativo' : ''}`} onClick={handleMenuClick}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </nav>
            <main>
                <section className="home">
                    <div className="home-text">
                        <h2 className="text-h2">Bem vindo ao Gestone</h2>
                        <h1 className="text-h1">Controle suas Finanças de Forma Simples e Eficaz</h1>
                        <p>Descubra como gerenciar seu dinheiro e alcançar seus objetivos financeiros com nosso sistema de gestão financeira pessoal</p>
                        <a href="Cadastro" className="home-cad">Fazer Cadastro</a>
                    </div>
                    <div className="home-img">
                        <img src='versaoLetraPreta.png'></img>
                    </div>
                </section>
            </main>
        </header>
    );
};

export default Header;

