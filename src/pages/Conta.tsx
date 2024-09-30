import { IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonBackButton, IonContent, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonText, IonButton } from '@ionic/react';
import "./Conta.css"
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../components/ThemeContext';


const Conta: React.FC = () => {
    const [userImg, setUserImg] = useState(Object);
    const [userName, setUserName] = useState(Object);
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);


    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const userPhoto = user.photoURL;
                const userName = user.displayName;
                setUserImg(userPhoto);
                setUserName(userName);
            }
        })
    })

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

            <IonGrid>
                <IonRow>
                    <IonCol className='user-info'>
                        {/* <IonImg src={userImg.toString()} className='user-photo' /> */}
                        <IonText>
                            <h2>{userName.toString()}</h2>
                        </IonText>
                    </IonCol>

                </IonRow>
            </IonGrid>


        </IonPage>
    );
}

export default Conta;