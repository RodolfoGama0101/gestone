import { IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonBackButton, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonText, IonButton, IonAvatar, IonCard, IonFooter, IonModal, IonInput } from '@ionic/react';
import "./css/Conta.css"
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../components/ThemeContext';
import { arrowBackOutline, brushOutline } from 'ionicons/icons';

const Conta: React.FC = () => {
    const [userImg, setUserImg] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Controla se está em modo de edição
    const [newName, setNewName] = useState(userName);  // Armazena o novo nome
    const [isLoading, setIsLoading] = useState(false);
    // const [transferenciaSelecionada, setTransferenciaSelecionada] = useState<SaldoData | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserImg(user.photoURL);
                setUserName(user.displayName);
                setUserEmail(user.email);
            } else {
                setUserImg(null);
                setUserName(null);
                setUserEmail(null);
            }
        });
        return () => unsubscribe(); // Clean up the subscription when the component unmounts
    }, []);

    function logout() {
        signOut(auth).then(() => {
            window.location.href = "/";
        }).catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage);
        });
    }



    // Função para alternar o modo de edição
    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    // Função para salvar o novo nome
    const saveName = () => {
        // Aqui você pode fazer um update no backend, se necessário
        toggleEdit(); // Fecha o modo de edição
    };

    return (
        <IonPage>
            <IonHeader className='ion-no-border'>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Sua Conta</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol className='user-info'>
                            {userImg ? (
                                <IonAvatar className='user-photo'>
                                    <IonImg src={userImg} />
                                </IonAvatar>
                            ) : (
                                <IonAvatar className='user-photo'>
                                    <IonImg src="/assets/default-avatar.png" /> {/* Avatar padrão */}
                                </IonAvatar>
                            )}
                        </IonCol>
                    </IonRow>
                    <IonGrid>
                        <div className='ion-text-center'>
                            <h2 className='ion-text-capitalize'>{userName ? userName : 'Carregando...'}</h2>
                            <p>{userEmail ? userEmail : 'Carregando...'}</p>
                        </div>

                        <div className="ion-text-center">
                            <IonButton onClick={() => setIsOpen(true)} className="ion-justify-content-center">
                                Editar
                            </IonButton>
                        </div>

                        <IonModal isOpen={isOpen} backdropDismiss={false}>
                            <IonHeader>
                                <IonToolbar color="success">
                                    <IonButtons slot="start">
                                        <IonButton onClick={() => setIsOpen(false)}><IonIcon aria-hidden="true" slot="icon-only" icon={arrowBackOutline} /></IonButton>
                                    </IonButtons>
                                    <IonText>Voltar</IonText>
                                </IonToolbar>
                            </IonHeader>

                            <IonGrid>
                                <IonRow>
                                    <IonCol className='user-info'>
                                        {userImg ? (
                                            <IonAvatar className='user-photo'>
                                                <IonImg src={userImg} />
                                            </IonAvatar>
                                        ) : (
                                            <IonAvatar className='user-photo'>
                                                <IonImg src="/assets/default-avatar.png" /> {/* Avatar padrão */}
                                            </IonAvatar>
                                        )}
                                    </IonCol>
                                    <IonCol>
                                        <IonButton>Editar Avatar</IonButton>
                                    </IonCol>
                                </IonRow>

                                <IonRow>
                                    <div className='ion-text-center'>
                                        <h2 className='ion-text-capitalize'>
                                            {isEditing ? (
                                                <>
                                                    <IonInput
                                                        value={newName}
                                                        onIonChange={(e: any) => setNewName(e.detail.value)}
                                                        placeholder="Digite o novo nome"
                                                    />
                                                    <IonButton onClick={saveName}>Salvar</IonButton>
                                                </>
                                            ) : (
                                                <>
                                                    {newName ? newName : 'Carregando...'}
                                                    <IonButton onClick={toggleEdit}>
                                                        <IonIcon icon={brushOutline} />
                                                    </IonButton>
                                                </>
                                            )}
                                        </h2>

                                        <p>{userEmail ? userEmail : 'Carregando...'} <IonButton><IonIcon icon={brushOutline} /></IonButton></p>
                                        <p>Password: </p>
                                    </div>
                                </IonRow>
                            </IonGrid>

                            <IonButton
                                onClick={() => {
                                    setIsLoading(true); // Inicia o carregamento

                                    // if (transferenciaSelecionada) {
                                    //     editFinance(
                                    //         transferenciaSelecionada.id,
                                    //         transferenciaSelecionada.tipo
                                    //     );
                                    // }

                                    // setUpdateSaldo(!updateSaldo); // Atualiza o saldo para refletir as mudanças
                                    // setIsOpen(false); // Fecha o modal após a edição

                                    <IonText>
                                        {/* <p>{isLoading ? "Carregando..." : "Salvar " + (tipoAtual === "receita" ? "Receita" : "Despesa")}</p> */}
                                    </IonText>
                                }}
                            ></IonButton>

                        </IonModal>
                    </IonGrid>

                </IonGrid>


            </IonContent>

            <IonFooter className='ion-no-border footer-logout ion-align-items-end'>
                <IonToolbar>
                    <IonButton expand="block" color={'danger'} className='ion-no-margin ion-float-' onClick={logout}>
                        Logout
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
}

export default Conta;
