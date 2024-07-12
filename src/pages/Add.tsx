import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import HeaderComponent from '../components/Header';
import './Add.css';
import FooterTabBar from '../components/FooterTabBar';
import Verifica from '../firebase/verifica';

const Add: React.FC = () => {
  Verifica();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/Home"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <h1 className='ion-text-center'>Add</h1>
      </IonContent>

      <FooterTabBar></FooterTabBar>
    </IonPage>
  );
};

export default Add;
