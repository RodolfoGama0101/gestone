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
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const Cadastro: React.FC = () => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [isLoading, setIsLoading] = useState(false);  // Estado para controlar o loading

    // Função de cadastro
    const fazerCadastro = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);  // Define o estado como carregando

        if (senha === confirmaSenha) {
            try {
                // Cria o usuário com e-mail e senha
                const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
                const user = userCredential.user;

                if (user) {
                    // Atualiza o nome do usuário
                    console.log("Atualizando o perfil...");
                    await updateProfile(user, { displayName: nome });
                    console.log("Perfil atualizado com sucesso!");

                    // Armazena o mês atual para início
                    console.log("Armazenando mês no Firestore...");
                    const refDocMes = doc(db, "MesSelecao", user.uid);
                    await setDoc(refDocMes, {
                        uid: user.uid,
                        mes: new Date().getMonth(), // Armazena o mês atual
                    });
                    console.log("Mês armazenado com sucesso!");

                    // Armazena as tags primárias de despesas
                    console.log("Armazenando tags no Firestore...");
                    const refDocTags = doc(db, "TagsDespesas", user.uid);
                    await setDoc(refDocTags, {
                        tags: [
                            "Roupas", 
                            "Educação", 
                            "Eletrônicos", 
                            "Saúde", 
                            "Casa", 
                            "Lazer", 
                            "Restaurante", 
                            "Mercado", 
                            "Serviços", 
                            "Transporte", 
                            "Viagem", 
                            "Outros"
                        ]
                    });
                    console.log("Tags armazenadas com sucesso!");

                    // Redireciona o usuário após todas as operações assíncronas serem concluídas
                    window.location.href = "/home";
                }
            } catch (error) {
                console.error("Erro ao fazer o cadastro: ", error);
                window.alert("Erro ao cadastrar: " + error);  // Exibe a mensagem de erro completa
            } finally {
                setIsLoading(false);  // Define o estado como não carregando
            }
        } else {
            window.alert("As senhas não conferem.");
            setIsLoading(false);  // Define o estado como não carregando em caso de erro
        }
    };

    // Verifica login após a página carregar
    // useEffect(() => {
    //      const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             // Se o usuário já estiver logado, redireciona para a home
    //             window.location.href = '/home';
    //         }
    //     });

    //     return () => unsubscribe(); // Limpa o listener ao desmontar o componente
    // }, []);

    return (
        <IonContent color={"dark"}>
            <IonGrid fixed={false}>
                <IonRow class="ion-justify-content-center">
                    <IonImg src="./versao104.png" className="img-cadastro" />
                </IonRow>
                <IonRow class="row-cadastro">
                    <IonCol sizeXl="5">
                        <IonCard color={'dark2'}>
                            <IonCardHeader>
                                <IonCardTitle className="ion-text-center" color={"success"}>
                                    FAZER CADASTRO
                                </IonCardTitle>
                            </IonCardHeader>

                            <IonCardContent>
                                <IonInput
                                    className="input-cadastro"
                                    color={"success"}
                                    label='Nome: '
                                    placeholder="Jubileu Nemeu"
                                    clearInput
                                    labelPlacement="floating"
                                    fill="outline"
                                    onIonChange={(e: any) => setNome(e.target.value)}
                                />

                                <IonInput
                                    className="input-cadastro"
                                    color={"success"}
                                    label='Email:'
                                    placeholder='jubileu.nemeu@gmail.com'
                                    clearInput
                                    labelPlacement="floating"
                                    fill="outline"
                                    onIonChange={(e: any) => setEmail(e.target.value)}
                                />

                                <IonInput
                                    className="input-cadastro"
                                    color={"success"}
                                    label='Senha:'
                                    placeholder='Senha'
                                    type='password'
                                    clearInput
                                    labelPlacement='floating'
                                    fill='outline'
                                    onIonChange={(e: any) => setSenha(e.target.value)}
                                />

                                <IonInput
                                    color={"success"}
                                    label='Confirme sua senha:'
                                    placeholder='Senha'
                                    type='password'
                                    clearInput
                                    labelPlacement='floating'
                                    fill='outline'
                                    onIonChange={(e: any) => setConfirmaSenha(e.target.value)}
                                />

                                <IonButton
                                    expand='block'
                                    color={'success'}
                                    className="ion-margin-top"
                                    onClick={fazerCadastro}
                                    disabled={isLoading}  // Desabilita o botão enquanto está carregando
                                >
                                    <IonText>
                                        <h2>{isLoading ? "Cadastrando..." : "Cadastrar"}</h2>
                                    </IonText>
                                </IonButton>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    );
};

export default Cadastro;
