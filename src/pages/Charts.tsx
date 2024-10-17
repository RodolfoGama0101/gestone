import { IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonPage, IonRow, IonText, IonToolbar } from '@ionic/react';
import './css/Cadastro.css';
import Verifica from '../firebase/verifica';
import { ThemeContext } from '../components/ThemeContext';
import { useContext, useState } from 'react';
import ChartDoughnut from '../components/ChartDoughnut';


const Charts: React.FC = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());
  const [receitaTotal, setReceitaTotal] = useState<number>(0);
  const [despesaTotal, setDespesaTotal] = useState<number>(0);
  const [tagsDataAgrupado, setTagsDataAgrupado] = useState<Record<string, number>>({});

  Verifica();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{
          '--background': 'var(--ion-background-color)', // Controla o fundo da página
          '--color': 'var(--ion-text-color)', // Controla a cor do texto
        }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/Home"></IonBackButton>
          </IonButtons>
          <IonText>
            <h1 className='ion-margin'>Gráficos</h1>
          </IonText>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{
        '--background': 'var(--ion-background-color)', // Controla o fundo da página
        '--color': 'var(--ion-text-color)', // Controla a cor do texto
      }}>

        <IonGrid>
          <IonRow>
            <IonCol>
            <ChartDoughnut
                dataMesSelecionado={dataMesSelecionado}
                setDataMesSelecionado={setDataMesSelecionado}
                receitaTotal={receitaTotal}
                setReceitaTotal={setReceitaTotal}
                despesaTotal={despesaTotal}
                setDespesaTotal={setDespesaTotal}
                tagsDataAgrupado={tagsDataAgrupado}
                setTagsDataAgrupado={setTagsDataAgrupado}
              />
            </IonCol>

            <IonText>
              <p>{despesaTotal}</p>
            </IonText>

            <IonCol>
              <IonList>
                <IonItem>
                  <IonLabel>Pokémon Yellow</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>Mega Man X</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>The Legend of Zelda</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>Pac-Man</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>Super Mario World</IonLabel>
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>



      </IonContent>
    </IonPage>
  );
};

export default Charts;