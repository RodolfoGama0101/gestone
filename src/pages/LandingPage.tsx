import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon } from "@ionic/react";
import "./css/LandingPage.css"
import React from "react";

const LandingPage: React.FC = () => {
    return (

        <>
            <IonMenu contentId="main-content" side='end'>
                <IonHeader>
                    <IonToolbar color={'dark'}>
                        <IonTitle></IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        <IonItem routerLink="/settings">
                            <IonLabel>Settings</IonLabel>
                        </IonItem>
                        <IonItem routerLink="/home">
                            <IonLabel>Home</IonLabel>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonMenu>
            <IonPage id="main-content">

                <header className="header" id="main-content">
                    <nav className="navigation">
                        <a href="landingpage" className="logo"> <img src="versao106.png" /></a>
                        <IonButtons>
                            <IonMenuButton className="menu"></IonMenuButton>
                        </IonButtons>
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
                                <img src='versaoLetraBranca.png'></img>
                            </div>
                        </section>
                    </main>
                </header>

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
            </IonPage>
        </>
    );
}

export default LandingPage;