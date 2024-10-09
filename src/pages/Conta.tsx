import { IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonBackButton, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonText, IonButton, IonAvatar, IonCard } from '@ionic/react';
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
            <IonHeader>
                <IonToolbar color={'success'}>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/Home" color={'light'}></IonBackButton>
                    </IonButtons>
                    <IonTitle>Sua Conta</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol className='user-info'>
                            {userImg ? (
                                <IonAvatar className='user-photo' >
                                    <IonImg src={userImg} />
                                </IonAvatar>
                            ) : (
                                <IonAvatar className='user-photo'>
                                    <IonImg src="/assets/default-avatar.png" /> {/* Um avatar padrão se a foto não estiver disponível */}
                                </IonAvatar>
                            )}
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonText className='ion-aling-text-start'>
                    <h4>Account Information:</h4>
                </IonText>
                <IonCard className='ion-padding'>
                    <IonText className='text-name'>
                        <h3>Nome: {userName ? userName : 'Usuário Desconhecido'}</h3>
                    </IonText>
                </IonCard>
                <IonCard className='ion-padding'>
                    <IonText className='text-name'>
                        <h3>E-mail: {userEmail ? userEmail : 'Email Desconhecido'}</h3>
                    </IonText>
 
                </IonCard>

                <IonGrid>
                    <IonRow>
                        <IonButton color={'success'}>
                            Editar
                        </IonButton>
                    </IonRow>
                    <IonRow>
                        <IonButton color={'danger'}>
                            Logout
                        </IonButton>
                    </IonRow>
                </IonGrid>


            </IonContent>

        </IonPage>
    );
}

export default Conta;
