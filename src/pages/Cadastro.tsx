import {
    IonGrid,
    IonRow,
    IonImg,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonText,
    IonContent,

} from "@ionic/react";
import './Cadastro.css';
import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithEmailLink } from "firebase/auth";

const Cadastro: React.FC = () => {

    var [nome, setNome] = useState("");
    var [email, setEmail] = useState("");
    var [senha, setSenha] = useState("");

    // Cadastro com email e senha
    function fazerCadastro() {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                window.location.href = "./Home";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + " - " + errorMessage)
            });
    }

    return (
        <>
            <IonContent color={"dark"}>
                <IonGrid fixed={false}>
                    <IonRow class="ion-justify-content-center">
                        <IonImg src="./versao104.png" className="gestone-start-login" />
                    </IonRow>
                    <IonRow class="ion-justify-content-center">
                        <IonCol sizeXl="5">
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle className="ion-text-center" color={"success"}>FAZER CADASTRO</IonCardTitle>
                                </IonCardHeader>

                                <IonCardContent>
                                    <IonInput color={"dark"} label='Usuário: ' placeholder="Fulano Silva" clearInput labelPlacement="floating" fill="solid" onIonChange={(e: any) => setNome(e.target.value)}></IonInput>

                                    <IonInput color={"dark"} label='Login:' placeholder='Email ou CPF' clearInput labelPlacement="floating" fill="solid" onIonChange={(e: any) => setEmail(e.target.value)}></IonInput>

                                    <IonInput color={"dark"} label='Senha:' placeholder='Senha' type='password' clearInput labelPlacement='floating' fill='solid' onIonChange={(e: any) => setSenha(e.target.value)}></IonInput>

                                    <IonButton expand='block' color={'success'} className="ion-margin-top" onClick={(fazerCadastro)}>
                                        <IonText> <h2>Cadastrar</h2> </IonText>
                                    </IonButton>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>

        </>
    );
};

export default Cadastro;