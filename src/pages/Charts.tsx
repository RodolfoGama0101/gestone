import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import './Charts.css';
import FooterTabBar from '../components/FooterTabBar';
import { personCircleOutline } from 'ionicons/icons';


const Charts: React.FC = () => {
  return (
    <IonPage>
      {/* Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar color={'dark'}>
          <IonButtons slot="end" className="ion-margin-right">
            <IonMenuButton>
              <IonIcon icon={personCircleOutline} size='large'></IonIcon>
            </IonMenuButton>
          </IonButtons>
          <IonText className='ion-text-center'>
            <h1>Grafics</h1>
          </IonText>
        </IonToolbar>
      </IonHeader>

      <FooterTabBar></FooterTabBar>
    </IonPage>
  );
};

export default Charts;
