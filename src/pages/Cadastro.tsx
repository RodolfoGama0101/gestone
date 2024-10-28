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
    IonInputPasswordToggle,
    IonItem,
    IonList,
} from "@ionic/react";
import './css/Cadastro.css';
import React, { useState, useEffect, useContext } from 'react';
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, getAuth } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ThemeContext } from '../components/ThemeContext';

const Cadastro: React.FC = () => {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [isLoading, setIsLoading] = useState(false);  // Estado para controlar o loading
    const { isDarkMode } = useContext(ThemeContext);

    // Função de cadastro
    const fazerCadastro = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);  // Define o estado como carregando

        if (senha == confirmaSenha) {
            try {
                // Cria o usuário com e-mail e senha
                const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
                const user = userCredential.user;
                const defaultAvatarUrl = "https://firebasestorage.googleapis.com/v0/b/gestone-d508a.appspot.com/o/boneco.svg?alt=media&token=a1521066-52cf-49f2-9d84-78a8085807d4";

                if (user) {
                    // Atualiza o nome do usuário
                    console.log("Atualizando o perfil...");
                    await updateProfile(user, { displayName: nome });
                    console.log("Perfil atualizado com sucesso!");

                    updateProfile(user, {
                        photoURL: defaultAvatarUrl
                    }).then(() => {
                        console.log("Perfil do usuário atualizado com avatar padrão.");
                    }).catch((error) => {
                        console.error("Erro ao atualizar perfil do usuário:", error);
                    });

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
        <IonContent style={{
            '--background': 'var(--ion-color-primary)', // Controla o fundo da página
            '--color': 'var(--ion-text-color)', // Controla a cor do texto
        }}>
            <IonGrid fixed={false}>
                <IonRow class="ion-justify-content-center">
                    <IonImg src="./versao106.png" className="img-cadastro" />
                </IonRow>
                <IonRow class="row-cadastro">
                    <IonCol sizeXl="5">
                        <IonCard style={{
                            '--background': 'var(--ion-background-color)', // Controla o fundo da página
                            '--color': 'var(--ion-text-color)', // Controla a cor do texto
                        }}>
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
                                    placeholder="Kauã Leonardo"
                                    clearInput
                                    labelPlacement="stacked"
                                    fill="outline"
                                    onIonChange={(e: any) => setNome(e.target.value)}
                                />

                                <IonInput
                                    className="input-cadastro"
                                    color={"success"}
                                    label='Login:'
                                    placeholder='kaua.janucci@gmail.com'
                                    clearInput
                                    labelPlacement="stacked"
                                    fill="outline"
                                    onIonChange={(e: any) => setEmail(e.target.value)}
                                />

                                <IonInput
                                    className="input-cadastro"
                                    color={"success"}
                                    label='Senha:'
                                    placeholder='********'
                                    type='password'
                                    labelPlacement='stacked'
                                    fill='outline'
                                    onIonChange={(e: any) => setSenha(e.target.value)}
                                > <IonInputPasswordToggle slot="end" color={"success"}></IonInputPasswordToggle> </IonInput>



                                <IonInput
                                    className="input-cadastro"
                                    color={"success"}
                                    label='Confirme sua senha:'
                                    placeholder='********'
                                    type='password'
                                    labelPlacement='stacked'
                                    fill='outline'
                                    onIonChange={(e: any) => setConfirmaSenha(e.target.value)}
                                > <IonInputPasswordToggle slot="end" color={"success"}></IonInputPasswordToggle> </IonInput>

                                <IonButton
                                    expand='block'
                                    color={'success'}
                                    className="ion-margin-top ion-no-margin"
                                    onClick={fazerCadastro}
                                    disabled={isLoading}  // Desabilita o botão enquanto está carregando
                                >
                                    <IonText>
                                        <h2>{isLoading ? "Cadastrando..." : "Cadastrar"}</h2>
                                    </IonText>
                                </IonButton>

                                <div className="text-voltar-cadastro">
                                    <IonText>
                                        <a href="/Inicial" className="voltar">Voltar</a>
                                    </IonText>
                                </div>

                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    );
};

export default Cadastro;
