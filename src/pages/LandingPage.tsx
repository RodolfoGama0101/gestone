import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon, IonNav, IonNavLink, IonGrid, IonRow, IonCol, IonFooter } from "@ionic/react";
import "./css/LandingPage.css"
import React from "react";

const LandingPage: React.FC = () => {
    return (

        <>
            <IonMenu contentId="main-content" side='end'>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle></IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        <IonItem routerLink="/Cadastro">
                            <IonLabel>Cadastro</IonLabel>
                        </IonItem>
                        <IonItem routerLink="/Login">
                            <IonLabel>Login</IonLabel>
                        </IonItem>
                        <IonItem routerLink="/support">
                            <IonLabel>Support</IonLabel>
                        </IonItem>
                    </IonList>
                </IonContent>

                {/* Menu */}
            </IonMenu>
            <IonPage id="main-content">
                <IonContent fullscreen>
                    <IonHeader id="main-content">
                        <IonNavLink className="navigation">
                            <a href="landingpage" className="logo"> <img src="versao106.png" /></a>
                            <IonButtons>
                                <IonMenuButton className="menu"></IonMenuButton>
                            </IonButtons>
                        </IonNavLink>
                    </IonHeader>


                    <section className="container">
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <div className="home">
                                        <div className="home-text">
                                            <h2 className="text-h2">Bem vindo ao Gestone</h2>
                                            <h1 className="text-h1">Controle suas Finanças de Forma Simples e Eficaz</h1>
                                            <p>Descubra como gerenciar seu dinheiro e alcançar seus objetivos financeiros com nosso sistema de gestão financeira pessoal</p>
                                            <a href="Cadastro" className="home-cad">Fazer Cadastro</a>
                                        </div>
                                        <div className="home-img">
                                            <div className="circle-bg"></div>
                                            <img src='versaoLetraBranca.png'></img>
                                        </div>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </section>

                    {/* Testimonials */}
                    <section className="testimonials">
                        <h2>O Que Nossos Usuários Dizem</h2>
                        <div className='carousel'>
                            <div className="divbox">
                                <p>"É um aplicativo realmente util usei para arrumar minha vida financeira tendo mais conhecimento dos meus gastos." - Luiz Miranda</p>
                            </div>
                            <div className="divbox">
                                <p>"Gestone facilita o controle das finanças com uma interface prática, permitindo visão clara dos gastos e do orçamento." - Arthur Moraes</p>
                            </div>
                            <div className="divbox">
                                <p>"Gestone facilitou meu controle financeiro. Agora, posso acompanhar gastos diários de forma prática e organizada." - Kaua Leonardo</p>
                            </div>
                            <div className="divbox">
                                <p>"O Gestone me deu autonomia financeira, permitindo que eu gerencie minhas despesas e economize de forma consciente." - Samuel</p>
                            </div>
                            <div className="divbox">
                                <p>"Funcional e completo, o Gestone tem todas as ferramentas para registro de gastos e metas personalizadas." - Paulo Henrique</p>
                            </div>
                        </div>
                    </section>

                    {/* Benefits */}
                    <IonRow className="benefits">
                        <IonCol className="left">
                            <div className="video">
                                <div className="video-dim">
                                    <video autoPlay muted loop src="Gestonevideo.mp4"></video>
                                </div>
                            </div>
                        </IonCol>
                        <IonCol className="right">
                            <div className="qrcode">
                                <IonLabel className="qrcode-img">
                                    <p>Acessa Ai!!</p>
                                    <img src='QRCode.png'></img>
                                </IonLabel>
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonFooter className="footer">
                        <IonItem>
                            &copy; 2024 Gestone. Todos os direitos reservados.
                        </IonItem>
                    </IonFooter>

                </IonContent>

            </IonPage >
        </>
    );
}

export default LandingPage;