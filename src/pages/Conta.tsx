import { IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonBackButton, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonText, IonButton, IonAvatar, IonCard, IonFooter } from '@ionic/react';
import "./css/Conta.css"
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../components/ThemeContext';

const Conta: React.FC = () => {
    const [userImg, setUserImg] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

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

    return (
        <IonPage>
            <IonHeader className='ion-no-border'>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home" color={'light'}></IonBackButton>
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
                            <h2 className='ion-text-capitalize'>{userName ? userName : 'Usuário Desconhecido'}</h2>
                            <p>{userEmail ? userEmail : 'Email Desconhecido'}</p>
                        </div>
                    </IonGrid>
                </IonGrid>


            </IonContent>

            <IonFooter className='ion-no-border footer-logout ion-align-items-end'>
                <IonToolbar>
                    <IonButton expand="block" color={'danger'} className='ion-no-margin ion-float-'>
                        Logout
                    </IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
}

export default Conta;
