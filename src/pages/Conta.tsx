import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonBackButton,
    IonContent,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonText,
    IonButton,
    IonAvatar,
    IonFooter,
    IonModal,
    IonInput,
} from '@ionic/react';
import "./css/Conta.css";
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import { arrowBackOutline, brushOutline } from 'ionicons/icons';

const Conta: React.FC = () => {
    const [userImg, setUserImg] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState<string | null>(userName);
    const [newEmail, setNewEmail] = useState<string | null>(userEmail);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserImg(user.photoURL);
                setUserName(user.displayName);
                setUserEmail(user.email);
                setNewName(user.displayName);
                setNewEmail(user.email);
            } else {
                setUserImg(null);
                setUserName(null);
                setUserEmail(null);
            }
        });
        return () => unsubscribe();
    }, []);

    function logout() {
        signOut(auth).then(() => {
            window.location.href = "/";
        }).catch((error) => {
            alert(error.message);
        });
    }

    const toggleEditName = () => {
        setIsEditingName(!isEditingName);
    };

    const handleSaveName = async () => {
        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: newName });
                setUserName(newName);
                window.alert("Nome alterado com sucesso!");
            } else {
                window.alert("Usuário não autenticado.");
            }
        } catch (error) {
            console.error("Erro ao atualizar o nome:", error);
            window.alert("Erro ao atualizar o nome.");
        } finally {
            setIsEditingName(false); // Garante que o estado de edição seja fechado
        }
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
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
                        <IonCol className="user-info">
                            {userImg ? (
                                <IonAvatar className="user-photo">
                                    <IonImg src={userImg} />
                                </IonAvatar>
                            ) : (
                                <IonAvatar className="user-photo">
                                    <IonImg src="/assets/default-avatar.png" />
                                </IonAvatar>
                            )}
                        </IonCol>
                    </IonRow>

                    <IonGrid>
                        <div className="ion-text-center">
                            <h2 className="ion-text-capitalize">
                                {userName ? userName : 'Carregando...'}
                            </h2>
                            <p>{userEmail ? userEmail : 'Carregando...'}</p>
                        </div>

                        <div className="ion-text-center">
                            <IonButton onClick={() => setIsOpen(true)} className="ion-justify-content-center">
                                Editar
                            </IonButton>
                        </div>

                        <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} backdropDismiss={false}>
                            <IonHeader>
                                <IonToolbar color="success">
                                    <IonButtons slot="start">
                                        <IonButton onClick={() => setIsOpen(false)}>
                                            <IonIcon aria-hidden="true" slot="icon-only" icon={arrowBackOutline} />
                                        </IonButton>
                                    </IonButtons>
                                    <IonTitle>Editar Perfil</IonTitle>
                                </IonToolbar>
                            </IonHeader>

                            <IonContent className="ion-padding">
                                <IonGrid>
                                    <IonRow className="ion-justify-content-center ion-align-items-center">
                                        <IonCol size="auto">
                                            <IonAvatar className="user-photo">
                                                <IonImg src={userImg || "/assets/default-avatar.png"} />
                                            </IonAvatar>
                                        </IonCol>
                                        <IonCol size="auto">
                                            <IonButton>Alterar Avatar</IonButton>
                                        </IonCol>
                                    </IonRow>

                                    {/* Edição do Nome */}
                                    <IonRow className="ion-align-items-center ion-margin-top">
                                        <IonCol size="auto" style={{ display: 'flex', alignItems: 'center' }}>
                                            <IonText>
                                                <h2>Nome:</h2>
                                            </IonText>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow style={{ display: 'flex', alignItems: 'center', marginTop: '0' }}>
                                        <IonCol>
                                            {isEditingName ? (
                                                <IonInput
                                                    value={newName}
                                                    onIonChange={(e) => setNewName(e.detail.value!)}
                                                    placeholder="Digite o novo nome"
                                                />
                                            ) : (
                                                <IonText className="ion-text-capitalize">{userName}</IonText>
                                            )}
                                        </IonCol>
                                        <IonCol size="auto">
                                            <IonButton fill="clear" onClick={toggleEditName}>
                                                <IonIcon icon={brushOutline} color={'light'} />
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>

                                    {isEditingName && (
                                        <IonRow className="ion-justify-content-center ion-margin-top">
                                            <IonButton color="success" onClick={handleSaveName}>
                                                Salvar Nome
                                            </IonButton>
                                            <IonButton color="medium" onClick={toggleEditName}>
                                                Cancelar
                                            </IonButton>
                                        </IonRow>
                                    )}
                                </IonGrid>
                            </IonContent>
                        </IonModal>
                    </IonGrid>
                </IonGrid>
            </IonContent>

            <IonFooter className="ion-no-border footer-logout">
                <IonToolbar>
                    <IonButton expand="block" color="danger" onClick={logout}>
                        Logout
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default Conta;
