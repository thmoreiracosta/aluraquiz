import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import db from '../db.json';
import Widget from '../src/components/Widget';
import PageHead from '../src/components/PageHead';
import QuizLogo from '../src/components/QuizLogo';
import QuizContainer from '../src/components/QuizContainer';
import AlternativesForm from '../src/components/AlternativesForm';
import QuizBackground from '../src/components/QuizBackground';
import Button from '../src/components/Button';

// const QuizContainer = styled.div`
//   width: 100%;
//   max-width: 350px;
//   padding-top: 45px;
//   margin: auto 10%;
//   @media screen and (max-width: 500px) {
//     margin: auto;
//     padding: 15px;
//   }
// `;

function ResultWidget({ results }) {
  return (
    <Widget>
      <Widget.Header>
        Tela de Resultado:
      </Widget.Header>

      <Widget.Content>
        <p>
          Você acertou
          {' '} 
          {/*{results + results.reduce((somatoriaAtual, resultAtual) => {
            const isAcerto = resultAtual === true;
            if (isAcerto) {
              return somatoriaAtual + 1;
            }
            return somatoriaAtual;
          }, 0)} */}
          {results.filter((x) => x).length}
          {' '}
          perguntas
        </p>
        <ul>
          {results.map((results, index) => (
            <li key={`results__${results}`}>
            #
            {index + 1}
            {' '} 
            Resultado:
            {results === true 
              ? 'Acertou' 
              : 'Errou'}
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function LoadingWidget() {
  return (
    <Widget>
    <Widget.Header>
      Carregando...
    </Widget.Header>

    <Widget.Content>
      [Desafio do Loading]
    </Widget.Content>
  </Widget>
);
}

function QuestionWidget({ 
  question, 
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
  }) {
    const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
    const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
    const questionId = `question__${questionIndex}`;
    const isCorrect = selectedAlternative === question.answer;
    const hasAlternativeSelected = selectedAlternative !== undefined;
    return (
      <Widget>

      <Widget.Header>
        {/* <BackLinkArrow href="/" /> */}
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>
      <img
        alt="Descrição"
        style={{
          width: '100%',          
          heigth: '150px',
          objectFit: 'cover',
       }}
     src={question.image}
    />
   <Widget.Content>
     <h2>
       {question.title}
     </h2>

     <p>
       {question.description}
     </p>

       <AlternativesForm onSubmit={(event) => {
         event.preventDefault();
         setIsQuestionSubmited(true);
         setTimeout(() => {
          addResult(isCorrect);
          onSubmit();
          setIsQuestionSubmited(false);
          setSelectedAlternative(undefined);
         }, 2 * 1000);
       }}
      >
        {question.alternatives.map((alternative, alternativeIndex) => {
          const alternativeId = `alternative__${alternativeIndex}`;
          const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
          const isSelected = selectedAlternative === alternativeIndex;
          return (
           <Widget.Topic
            as="label"
            key={alternativeId}
            htmlFor={alternativeId}
            data-selected={isSelected}
            data-status={isQuestionSubmited && alternativeStatus}
           >
             <input
              style={{ display: 'none'}}
              id={alternativeId}
              onChange={() => setSelectedAlternative(alternativeIndex)}
              name={questionId}
              type="radio"
            />
            {alternative}  
           </Widget.Topic>
         )
       })}

        {/*<pre>
          {JSON.stringify(question, null, 4)}
        </pre> */}
        <Button type="submit" disabled={!hasAlternativeSelected}>
          Confirmar
        </Button>
        {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
        {isQuestionSubmited && !isCorrect && <p> Você errou!</p>}
      </AlternativesForm>
    </Widget.Content>
  </Widget>
 )
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};
export default function QuizPage() {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];
  const totalQuestions = db.questions.length;
    
  function addResult(result) {
   // results.push(result);
    setResults([
      ...results,
      result
    ]);
  }

  // [React chama de: Efeitos || Effects]
  // React.useEffect
  // atualizado === wilUpdate
  // morre === willUnmount
  React.useEffect(() => {
    //fetch() ...
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  // nasce === didMount
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if(nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <PageHead />
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && 
        <QuestionWidget 
          question={question}
          questionIndex={questionIndex}
          totalQuestions={totalQuestions}
          onSubmit={handleSubmitQuiz}
          addResult={addResult}
        />
      }

        {screenState === screenStates.LOADING && <LoadingWidget />}
          
        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}