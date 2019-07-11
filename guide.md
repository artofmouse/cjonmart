# CJ더마켓 모바일 퍼블리싱 가이드

## 환경 및 설정

### 호환성

* Android Ver4.3 이상 / 아이폰 5 기준으로 진행 (320px)

### 웹 접근성

* 모바일 애플리케이션 콘텐츠 접근성지침2.0을 바탕으로 웹 접근성을 준수 한다.

### 파일 및 폴더 구조

``` html
gulpfile.js                             Gulp javascript 파일
package.json                            Gulp 구동을 위한 package module json파일
cjom/                                   루트폴더
    index.html                          web / mobile index 파일
    mobile/                             모바일 폴더
        css/                            css 파일
            common.css                  레이아웃 및 공통 css 파일
            main.css                    메인 페이지 css 파일
            sub.css                     서프 페이지 css 파일
            reset.css                   초기화 css 파일
            event/                      오픈이벤트 css 폴더
                1907_openevent.css
            lib/                        라이브러리 css 폴더
                glider.css
                jquery-ui.css
                slick.css
                swiper.css
                swiper.min.css
        font/                           font 파일
        html/                           html 파일
        images/                         image 파일
        include/                        header, footer 인클루드 파일
        js/                             javascript 폴더
            common.js                   공통 javascript 파일
```

### 프로젝트 시작

#### 1. Node.js 설치

* [Nodejs 다운로드](https://nodejs.org/ko/) 현재버전이 아닌 LTS버전 다운로드

#### 2. tortoiseSVN 설치

* [tortoiseSvn 다운로드](https://tortoisesvn.net/downloads.html) fot 64-bit OS 로 다운로드

#### 3. tortoiseSVN을 이용하여 프로젝트 파일 다운로드

1. 원하는 폴더에 가서 마우스 우클릭 후 "SVN Checkout" 클릭
2. URL of repository 입력란에 **"svn://10.64.0.134/publish/trunk/web"** 경로 입력

#### 4. Command line tool 실행

```javascript
// 해당하는 경로로 이동 (아래는 예시 경로 입니다.)
C:\onmart>
// npm -v 입력
C:\onmart> npm -v
// 아래와 같이 자신이 설치한 버전이 나오면 정상
6.4.1
// package.json에 있는 dependency 설치
C:\onmart> npm install
// Global 에 gulp 설치
C:\onmart> npm install -g gulp
// Gulp 서버 실행
C:\onmart> gulp
// RESULT
C:\onmart>gulp
[09:00:14] Using gulpfile C:\onmart\gulpfile.js
[09:00:14] Starting 'browsersync'...
[09:00:14] Finished 'browsersync' after 13 ms
[09:00:14] Starting 'html'...
[09:00:14] Finished 'html' after 8.18 ms
[09:00:14] Starting 'watch'...
[09:00:27] Finished 'watch' after 12 s
[09:00:27] Starting 'default'...
[09:00:27] Finished 'default' after 30 μs
[Browsersync] Access URLs:
 --------------------------------------
       Local: http://localhost:3000
    External: http://52.90.111.234:3000
 --------------------------------------
          UI: http://localhost:3001
 UI External: http://localhost:3001

```

### 5. 브라우저 오픈 후 http://localhost:3000 경로로 이동

## HTML 가이드

### 기본규칙

* **DOCTYPE**
    <br>HTML 문법은 해당 DTD의 명세에 기반하되,	최신트랜드와 확장성 및 호환성을 고려하여 HTML5 기준으로 작성한다.
    ``` html
    <!DOCTYPE html>
    ```

### 코딩 규칙

* BEM
    * BEM이란 블럭(Block), 요소(Element), 변환자 (Modifier) 으로 구성되어 있다.
    * 블럭(Block)은 컴포넌트의 가장 최상의 요소이다.
    * 요소(Element)는 컴포넌트의 하위 요소이다.
    * 변환자(Modifier)는 컴포넌트의 하위 구성요소의 변환자이다.<br>( **ex : color: #000 --> color: #fff 처럼 수정이 필요한 경우** )

* BEM을 이용한 HTML 작성방식
    ```html
    <div class="sample"> <!-- Block -->
        <div class="sample__element"> <!-- Element -->
            <div class="sample__modifier sample__modifier--white"> <!-- Modifier -->
            </div>
        </div>
    </div>
    ```
* BEM을 이용한 CSS 작성방식
    ```css
    .sample {width: 500px; height: 500px;}
    .sample__element {}
    .sample__modifier {background-color: #000;}
    .sample__modifier--white {background-color: #fff;}
    ```

## JAVASCRIPT 가이드

모든 스크립트는 common.js 에서 실행 및 관리됩니다.

### 주요 플러그인 사용 가이드
* 모든 플러그인은 document.ready 시점에 initialized 되어 따로 스크립트 작성이 필요 하지 않습니다.
* 모든 플러그인은 웹접근성 준수가 되어있습니다.

#### TOGGLE

```html
<!-- HTML -->
<div class="your-class" data-js="toggle"
    data-options='{"onChangeBeforeText": "열기", "onChangeAfterText": "닫기"}'>
    <a class="subtitles-toggle__anchor" href="#" data-js="toggle__anchor">
        열기
    </a>
    <div class="subtitles-toggle__pannel" data-js="toggle__panel">
        내용 입력란.
    </div>
</div>
```

```javascript
// javascript 주요 메소드
var yourVariable = $('.your-class').data('plugin_toggle');

yourVariable.show(); //패널 열기
yourVariable.hide(); //패널 닫기

// 비동기 마크업 변경된 경우 아래와 같이 호출
$('[data-js=checkbox]').toggle();
```

#### TAB

```html
<!-- HTML -->
<div class="your-class" data-js="tab">
    <ul>
        <li data-js="tab__list"><a href="#" id="your-id1" data-js="tab__anchor">tab-anchor1</a></li>
        <li data-js="tab__list"><a href="#" id="your-id2" data-js="tab__anchor">tab-anchor2</a></li>
        <li data-js="tab__list"><a href="#" id="your-id3" data-js="tab__anchor">tab-anchor3</a></li>
    </ul>

    <div data-js="tab__panel"> tab-panel1 </div>
    <div data-js="tab__panel"> tab-panel2 </div>
    <div data-js="tab__panel"> tab-panel3 </div>
</div>
```

```javascript
// 메소드
var yourVariable = $('.your-class').data('plugin_tab');
yourVariable.show("#your-id1"); //탭 열기

// 탭 전환 후 이벤트
$('body').on('TAB_CHANGE', function( plugin, pluginElement ) {
    console.log( plugin, pluginElement );
})

// 비동기 마크업 변경된 경우 아래와 같이 호출
$('[data-js=checkbox]').tab();
```

#### ACCORDION

```html
<!-- HTML -->
<ul class="your-class" data-js="accordion">
    <li data-js="accordion__item">
        <a href="#" id="your-id1" data-js="accordion__anchor">accordion__anchor1</a>
        <div data-js="accordion__panel">accordion__panel1</div>
    </li>
    <li data-js="accordion__item">
        <a href="#" id="your-id2" data-js="accordion__anchor">accordion__anchor2</a>
        <div data-js="accordion__panel">accordion__panel2</div>
    </li>
    <li data-js="accordion__item">
        <a href="#" id="your-id3" data-js="accordion__anchor">accordion__anchor3</a>
        <div data-js="accordion__panel">accordion__panel3</div>
    </li>
</ul>
```

```javascript
// 메소드
var yourVariable = $('.your-class').data('plugin_accordion');
$('.your-class').data('plugin_accordion')._open($('#your-id1')); // 아코디언 열기

// 비동기 마크업 변경된 경우 아래와 같이 호출
$('[data-js=checkbox]').accordion();
```

#### CHECKBOX

```html
<!-- HTML -->
<div class="checkbox" data-js="checkbox">
    <div id="your-id" class="checkbox__input" role="checkbox" data-js="checkbox__input">
        checkbox
        <input type="checkbox" class="checkbox__hidden" data-js="checkbox__hidden" />
    </div>
    <div id="your-id" class="checkbox__input" role="checkbox" data-js="checkbox__input">
        checkbox
        <input type="checkbox" class="checkbox__hidden" data-js="checkbox__hidden" />
    </div>
</div>
```

```javascript
// 메소드
 $('#your-id').trigger('checked'); //체크박스 선택
 $('#your-id').trigger('unchecked'); //체크박스 해제

// 비동기 마크업 변경된 경우 아래와 같이 호출
$('[data-js=checkbox]').checkbox();
```

#### RADIO

```html
<!-- HTML -->
<div class="radio" role="radiogroup" data-js="radio">
    <div class="radio__group-title" data-js="radio__title">카테고리 선택</div>
    <div class="radio__wrap">
        <div id="your-id" class="radio__input" role="radio" data-js="radio__input">
            카테고리1 카테고리1
            <input type="radio" name="category" class="radio__hidden" data-js="radio__hidden"/>
        </div>
        <div id="your-id" class="radio__input" role="radio" data-js="radio__input">
            카테고리2 카테고리2
            <input type="radio" name="category" class="radio__hidden" data-js="radio__hidden"/>
        </div>
        </div>
    </div>
</div>
```

```javascript
// 메소드
$('#your-id').trigger('checked');
$('#your-id').trigger('unchecked');

// 비동기 마크업 변경된 경우 아래와 같이 호출
$('[data-js=radio]').radio();
```

#### MODAL

```html
<!-- HTML -->
<body>
    <div id="wrap">
    </div>
    <!-- Modal Container -->
    <div class="modal-container" data-js="modal">
        <section id="modal" class="modal" data-js="modal__element">
            <div class="modal__mask" data-js="modal__mask"></div>
            <div class="modal__container modal__container--white" data-js="modal__container">
                <div class="modal__header">
                    <h1 class="modal__header-title">타이틀</h1>
                </div>
                <div class="modal__contents">
                </div>
                <button class="modal__close" data-js="modal__close">
                    <span class="blind">레이어 닫기</span>
                </button>
            </div>
        </section>
    </div>
    <!-- //Modal Container -->
</body>
```

```javascript
// * 비동기통신을 이용하여 Modal 마크업을 가져온 경우 아래와 같이 실행해주세요.
$('[data-js=modal]').modal();

// * Modal Initialized 후 Modal 컨트롤 방법 #modal은 유니크한 ID 사용 부탁드립니다.
* Modal Open
$('[data-js=modal]').trigger('open', $('#modal'));
* Modal Close
$('[data-js=modal]').trigger('close', $('#modal'));
```