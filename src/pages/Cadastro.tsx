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
import React, { useState } from 'react';
import { createUserWithEmailAndPassword} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const Cadastro: React.FC = () => {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");

    const fazerCadastro = async (e: any) => {
        e.preventDefault();

        if (senha == confirmaSenha) {
            await createUserWithEmailAndPassword(auth, email, senha)
                .then(async () => {
                    const user = auth.currentUser;
                    // console.log(user);
                    if (user) {
                        await setDoc(doc(db, "Users", user.uid), {
                            email: user.email,
                            firstName: nome
                        });
                    }

                    window.alert("User Registered Successfully!!");

                    window.location.href = "./Login";
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode);
                    window.alert(errorMessage);
                })
        } else {
            window.alert("As senhas não conferem");
        }
    };

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

                                    <IonInput color={"dark"} label='Confirme sua senha:' placeholder='Senha' type='password' clearInput labelPlacement='floating' fill='solid' onIonChange={(e: any) => setConfirmaSenha(e.target.value)}></IonInput>

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