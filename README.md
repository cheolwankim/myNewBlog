# 📝 My Blog - 풀스택 블로그 프로젝트

> 사용자 인증, 게시글 및 댓글 기능이 포함된 React + Express + MongoDB 기반의 실전형 블로그 애플리케이션입니다.

<br>

---

## 🌐 배포 주소

- **Frontend (Vercel)** 👉 [https://your-vercel-url.vercel.app](https://my-new-blog-self.vercel.app/)
- **Backend (Render)** 👉 [https://notion-backend-your.onrender.com](https://mynewblog.onrender.com)

<br>

---

## ⚙️ 사용 기술

| 영역    | 기술 스택                                             |
| ----- | ------------------------------------------------- |
| 프론트엔드 | React (CRA), React Router v7, axios, LocalStorage |
| 백엔드   | Node.js, Express.js, MongoDB (Mongoose), JWT 인증   |
| 배포    | Vercel (정적 프론트), Render (백엔드 API 서버)              |
| 기타    | 환경 변수 관리, 클라우드 DB (MongoDB Atlas), CORS 설정        |

<br>

---

## 🔑 주요 기능 요약

- JWT 기반 회원가입 및 로그인 기능 구현
- 게시글 CRUD (작성/조회/수정/삭제)
- 댓글 작성 및 삭제 기능
- 작성자 권한 기반의 수정/삭제 제한
- 로그인 여부에 따라 동적 UI 렌더링
- 환경변수를 활용한 API 서버 분기 처리

<br>
---

## 주요 화면  

![Image](https://github.com/user-attachments/assets/7deb8b35-41f7-414f-86bd-34c660361c22)  
<br>
![Image](https://github.com/user-attachments/assets/a406622e-b9ed-4704-81bd-4827766b4a74)  
<br>
![Image](https://github.com/user-attachments/assets/e51ba5e1-b08e-4a05-bc33-7fde8d6f400f)  
<br>
![Image](https://github.com/user-attachments/assets/a7c4eb68-b7b6-41b6-927e-195c8ad447fd)  
<br>
![Image](https://github.com/user-attachments/assets/57410709-8c7f-45e4-b380-dd77d35bdee6)  
<br>


---

## 📁 폴더 구조

### 프론트엔드 (React CRA)

```
my-blog-client/
├── src/
│   ├── api/axiosInstance.js        // API 요청 전용 인스턴스
│   ├── pages/                      // 화면별 페이지 컴포넌트
│   ├── components/                 // 재사용 UI 컴포넌트
│   ├── contexts/AuthContext.js    // 로그인 상태 전역 관리
│   └── App.js
└── .env
```

### 백엔드 (Express)

```
blog-backend/
├── controllers/        // 비즈니스 로직 처리
├── models/             // Mongoose 스키마 정의
├── routes/             // API 라우팅 모듈
├── middleware/         // 인증 등 공통 미들웨어
└── server.js           // 서버 진입점
```

---

## 🔧 환경변수 설정 예시

### 프론트엔드 `.env`

```
REACT_APP_API_URL=https://mynewblog.onrender.com/api
```

### 백엔드 `.env`

```
MONGO_URI=<MongoDB Atlas 연결 URI>
JWT_SECRET=<JWT 서명 키>
CLIENT_URL=https://your-vercel-url.vercel.app
```

<br>

---

## 🛠 문제 해결 경험 (트러블슈팅)

| 문제 상황                    | 원인                        | 해결 방법                                                         |
| ------------------------ | ------------------------- | ------------------------------------------------------------- |
| `.map is not a function` | API 응답이 HTML (index.html) | API baseURL을 잘못 설정해 프론트 HTML을 받아온 경우 → `.env` 및 axios 인스턴스 수정 |
| CORS 오류                  | 백엔드 도메인이 프론트 요청 허용 안함     | Express에서 `cors({ origin: CLIENT_URL })` 설정 적용                |
| `localhost` 하드코딩         | 배포된 환경에서는 localhost가 없음   | 환경변수 기반으로 API 주소 관리 구조 변경                                     |
| 백엔드에 React가 올라감          | HTML 반환 → API 작동 안함       | Vercel은 프론트 전용, Render에는 백엔드만 따로 배포                           |

<br>

---

## ✨ 프로젝트에서 얻은 인사이트

- axios 인스턴스를 통한 API 구조화 및 재사용의 중요성
- 프론트-백 분리 구조에서의 CORS, 경로 충돌 문제를 실전으로 체감
- JWT 인증 흐름과 미들웨어 구조 학습
- 실제 배포 과정에서 환경변수 관리 및 라우팅 문제 해결 경험
- API 에러 응답 처리 및 디버깅 노하우 향상

<br>

---

## 📌 프로젝트 요약 키워드 (면접 대비)

- **SPA**, **JWT 인증**, **RESTful API**, **CORS 설정**, **axios 인스턴스**, **환경변수 관리**, **풀스택 배포 경험**, **React Router v7**, **비동기 처리 흐름**

---

## 🙋‍♂️ 만든 사람

- GitHub: [cheolwankim](https://github.com/cheolwankim)
- 실전 경험과 기술 학습을 겸해 진행
