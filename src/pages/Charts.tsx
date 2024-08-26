import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonText, IonToolbar } from '@ionic/react';
import './Charts.css';
import Verifica from '../firebase/verifica';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { collection, doc, getAggregateFromServer, getDoc, query, sum, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

ChartJS.register(
  Tooltip, 
  Legend, 
  ArcElement
)

const Charts: React.FC = () => {
  Verifica();

  const [userInfo, setUserInfo] = useState(Object);
  const [receitaTotal, setReceitaTotal] = useState(Number);
  const [despesaTotal, setDespesaTotal] = useState(Number);
  const [dataMesSelecionado, setDataMesSelecionado] = useState(new Date().getMonth());

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setUserInfo(user);

      if (!user) {
        window.location.href = '/login';
        return null;
      }

      if (user) {
        const uid = user.uid;

        // Receita
        const collReceitas = collection(db, 'UserFinance');
        const qReceitas = query(collReceitas, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "receita"));

        const snapshotReceitas = await getAggregateFromServer(qReceitas, {
          receitaTotal: sum('valor')
        });

        setReceitaTotal(snapshotReceitas.data().receitaTotal);

        // Despesa
        const collDespesas = collection(db, 'UserFinance');
        const qDespesas = query(collDespesas, where("uid", "==", uid), where("mes", "==", dataMesSelecionado), where("tipo", "==", "despesa"));

        const snapshotDespesas = await getAggregateFromServer(qDespesas, {
          despesaTotal: sum('valor')
        });

        setDespesaTotal(snapshotDespesas.data().despesaTotal);
      }
    })
  });

  const data = {
    labels: [
      'Despesas',
      'Receitas'
    ],
    datasets: [{
      label: 'R$ ',
      data: [despesaTotal, receitaTotal],
      backgroundColor: [
        'rgb(255, 0, 0)',
        'rgb(16, 12, 243)'
      ],
      hoverOffset: 20
    }
  ]
  };
  
  const config = {
    
  };

  return (
    <IonPage>
      {/* Header */}
      <IonHeader>
        <IonToolbar color={"dark"}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/Home"></IonBackButton>
          </IonButtons>
          <IonText>
            <h1 className='ion-margin'>Grafics</h1>
          </IonText>
        </IonToolbar>
      </IonHeader>


      <IonContent color={"dark"}>
        <Pie options={config} data={data}/>
      </IonContent>
    </IonPage>
  );
};

export default Charts;
