function getTodayKey() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`; // 예: 20250427
  }
  
  function joinQueue() {
    const todayKey = getTodayKey(); // 오늘 날짜로 키 생성
    const queueRef = db.ref("queue/" + todayKey);
  
    // 이미 줄섰는지 체크
    if (localStorage.getItem('queued') === todayKey) {
      alert("이미 줄서기에 참여하셨습니다!");
      return;
    }
  
    queueRef.once("value", (snapshot) => {
      const totalCount = snapshot.numChildren() + 1;
      const busNumber = Math.floor((totalCount - 1) / 45) + 1;
      const seatNumber = ((totalCount - 1) % 45) + 1;
  
      const newUser = queueRef.push();
      newUser.set({
        joinedAt: new Date().toISOString(),
        bus: busNumber,
        seat: seatNumber
      });
  
      document.getElementById("result").innerHTML =
        `<p>당신은 ${totalCount}번째입니다.<br>` +
        `배정된 호차: ${busNumber}호차<br>` +
        `호차 내 번호: ${seatNumber}번</p>`;
  
      // 로컬스토리지에 저장하여 중복 차단
      localStorage.setItem('queued', todayKey);
    });
  }
  