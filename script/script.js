$(function(){
    let currentTurn='blue';
    const resultTexts=['','도','개','걸','윳','모'];
    const resultnums=['','1','2','3','4','5'];
    let turnChangeTimer=null;
    function updateTurnMessage(){ //info에 턴 안내 메세지 변경 함수
        const teamName=(currentTurn==='blue') ? '청팀':'홍팀'; //현재 턴이 blue라면 청팀, 아니라면 홍팀으로
        const color=(currentTurn==='blue') ? '#46e':'#c43'; //현재 턴이 blue라면 색상 #46e, 아니라면 #c43
        $('.control>.info').html(teamName+'이 던질 차례입니다.').css({
            'background':(currentTurn==='blue') ? '#eef':'#fee', //글자 출력 후 스타일 배경색과 컬러 정의
            'color':color
        });
    }
    updateTurnMessage(); //info 출력 초기화
    function changeTurn(){ //턴 변경 blue가 현재 currentTurn이면 'red'로 아니면 'blue'로 갱신 후 info에 결과 출력
        currentTurn=(currentTurn==='blue') ? 'red':'blue';
        updateTurnMessage();
    }
    function showResult(num, extraTurn){ //랜덤 (1~5)값과 추가 턴 판단 (true/false)인자로 결과 출력
        let imgsrc=`./images/${num}.svg`;
        $('.playground>.piece_boards>.result').find('img').attr('src',imgsrc);
        // const teamName = (currentTurn==='blue') ? '청팀':'홍팀';
        // const color=(currentTurn==='blue') ? '#46e':'#c43'; //현재 턴이 blue면 청팀, 글자색 정의 red면 홍팀, 글자색 정의
        // const resultText=resultTexts[num]; //랜덤값으로 배열 요소 값 호출 (1~5qjsWo '도'~'모' 중 하나)
        // let message=`<img src="./images/${num}.svg" alt="result">`; //팀명-결과 형식의 문자열 구성
        const teamName=(currentTurn==='blue') ? '청팀':'홍팀';
        const color=(currentTurn==='blue') ? '#46e':'#c43';
        const resultText=resultnums[num]+'칸 이동해 주세요.';
        let message=teamName+'은 '+resultText;
        if(extraTurn){
            message+='';
        }
        $('.control>.info').html(message).css({
            'background':(currentTurn==='blue') ? '#eef':'#fee','color':color
        });
    }
    // showResult(4,true); (test)
    function scheduleNextTurn(extraTurn){
        if(turnChangeTimer){ //turnChangeTimer가 null 아니라면 (timeOutId로 정의되었다면)
            clearTimeout(turnChangeTimer); //기존 타이머 제거
        }
        if(!extraTurn){ //웇, 모가 아니라 추가 턴 판단 하니라면 3초 뒤 턴 변경
            turnChangeTimer=setTimeout(changeTurn,3000);
        }else{ //윷, 모인 경우 3초 뒤 같은 팀 턴 안내
            turnChangeTimer=setTimeout(updateTurnMessage,3000);
        }
    }
    $('.players').find('span').draggable({stack:'span'})
    //.randombox -- display:none <--> flex || .randombox>img src=> "./img/p1-0?.svg" ? (1~5)
    $('.players span').droppable({
        tolerance:'intersect',
        drop:function(event,ui){
            let droppedPiece=ui.draggable; //드래그 된 span
            let targetPiece=$(this); //드롭된 위치에 있는 span
            let droppedTeam=droppedPiece.parent().hasClass('blue') ? 'blue':'red';
            let targetTeam=targetPiece.parent().hasClass('blue') ? 'blue':'red';
            if(droppedTeam !== targetTeam){
                targetPiece.css({
                    left:'0px',
                    top:'0px'
                });
                //기존 턴 변경 타이머 취소
                if(turnChangeTimer){
                    clearTimeout(turnChangeTimer);
                }
                alert(droppedTeam+'팀이 '+targetTeam+'팀 말을 잡았습니다')
                //말을 잡은 팀 추가 기회
                currentTurn=droppedTeam; //드래그
                turnChangeTimer=setTimeout(updateTurnMessage, 2000);
            }
        }
    })
    function randomImg(){
        let num=Math.floor(Math.random()*5)+1;
        let imgsrc=`./images/2${num}.svg`;
        $('.randombox').find('img').attr('src',imgsrc);
        $('.randombox').css('display','flex');
        $('.randombox').delay(2000).fadeOut(150);
        //윷, 모 나오면 추가 기회
        const extraTurn=(num===4 || num===5); //true 반환
        setTimeout(function(){
            showResult(num,extraTurn);
            scheduleNextTurn(extraTurn);
        },2000);
    }
    $('.btn').on('click',function(){
        $('.randombox').hide();
        setTimeout(randomImg, 1500);
    });
    $('.resetbtn').on('click',function(){
        window.location.reload();
    })
})