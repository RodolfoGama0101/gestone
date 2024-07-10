import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import HeaderComponent from '../components/Header';
import './Charts.css';
import FooterTabBar from '../components/FooterTabBar';

const Charts: React.FC = () => {
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
        <h1 className='ion-text-center'>Charts</h1>
      </IonContent>

      <FooterTabBar></FooterTabBar>
    </IonPage>
  );
};

export default Charts;
