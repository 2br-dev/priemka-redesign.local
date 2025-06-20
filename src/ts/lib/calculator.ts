import template from './template';
import fullcard_tpl from './fullcardtpl';
import videocard_tpl from './videocardtpl';
import dataTpl from './data_tpl';
const mustache = require('mustache');

import { 
	IData, 
	ICardData, 
	IEducationLevel, 
	IEducationForm, 
	IRequirement, 
	IPreparedData, 
	ISection,
	IURLCardData
 } from "./card_interfaces";

class Calculator{

	outputContainer:HTMLElement;
	cards_data:IData;
	selectedCase:ICardData;
	filterParams = {
		quickSearch: "",
		level: "Бакалавриат/специалитет",
		Requirements: []
	}

	constructor(container:HTMLElement | string){
		if(typeof(container) == "string"){
			this.outputContainer = <HTMLElement>document.querySelector(container.toString());
		}else{
			this.outputContainer = <HTMLElement>container;
		}
		this.cards_data = {Elements: []};
	}

	init(){
		fetch('./lpk-2025/data/data.json')
		.then(response => response.json())
		.then(data => {
			let filteredData = this.filter(data);
			this.cards_data = data;
			this.render(filteredData);
			
			// Если в GET параметрах открыты координаты карточки, открываем её
			if(window.location.search != ""){
				let URLParamsString = window.location.search.substring(1);
				let URLParams = new URLSearchParams(URLParamsString);
				let id = parseInt(URLParams.get("id"));
				let form = URLParams.get("form");
				let level = URLParams.get("level");
	
				this.openCard(null, {
					Id: id,
					Form: form,
					Level: level
				})
			}
		})
	
		$('body').on('change', '[name="level"]', this.filterByLevel.bind(this)); 		// Эвент изменения уровня образования
		$('body').on('input', '[name="search"]', this.filterByText.bind(this)); 		// Эвент ввода поискового запроса
		$('body').on('click', '.tag', this.filterByTags.bind(this)); 					// Эвент клика на предметы ЕГЭ (теги)
		$('body').on('click', '.education-form', this.switchFormType.bind(this)); 		// Эвент переключения типа образования в карточке
		$('body').on('click', '#calc-apply', this.runFilters.bind(this)); 				// Запуск фильтрации
		$('body').on('click', '#calc-reset', this.resetFilters.bind(this)); 			// Сброс фильтрации
		$('body').on('click', '.faculty-header', this.toggleFaculty.bind(this)); 		// Переключение отображения факультета
		$('body').on('click', '.spec-card', this.openCard.bind(this));					// Открытие подробных данных о факультете
		$('body').on('click', '.faculty-modal-close', this.closeCard.bind(this));		// Закрытие модального окна при клике на нём
		$('body').on('click', '#share', this.shareModal.bind(this));					// Поделиться
		$('body').on('click', '.faculty-modal-wrapper', this.closeOutside.bind(this))	// Закрытие модального окна по клику мимо
		$('body').on('click', '.form-switcher a', this.switchModalForm.bind(this));		// Переключение формы обучения в модальном окне
		$('body').on('keyup', this.closeCardEsc.bind(this));							// Закрытие модального окна по Esc
		
		$('body').on('click', '[data-remark]', this.openRemark.bind(this));				// Открытие пояснения к стоимости
		$('body').on('click', '.remark-close-trigger', this.closeRemark.bind(this));	// Закрытие пояснения к стоимости по клику на X

		$('body').on('click', '.video-trigger', this.openVideoModal.bind(this));		// Открытие видео из модалки факультета

		$(window).on('popstate', this.historyPop.bind(this));

	}

	historyPop(e:any){
		let state = e.originalEvent.state;
		let modalOpened = document.querySelectorAll('.faculty-modal-wrapper.open').length > 0
		if(!state || modalOpened){
			this.closeCard();
		}else{
			this.openCard(null, null, state.selectedCase);
		}
	}

	/**
	 * Закрытие ремарки по клику на X
	 */
	closeRemark(e:JQuery.ClickEvent){
		e.preventDefault();
		let remark  = $(e.currentTarget).parents('.remark-popup');
		remark.removeClass('open');

		setTimeout(() => {
			remark.remove();
		}, 500)
	}

	/**
	 * Открытие пояснения к стоимости
	 */
	openRemark(e:JQuery.ClickEvent){
		let remark = e.currentTarget.dataset['remark'];

		// Проверяем наличие уже открытого popup'а
		if($('.remark-popup').length > 0){
			return null;
		}

		if(remark && remark != ""){

			// Формирование DOM
			let remarkPopup = document.createElement('div');
			remarkPopup.className = 'remark-popup';
			let remarkCloseTrigger = document.createElement('a');
			remarkCloseTrigger.className = 'bx bx-x remark-close-trigger';
			remarkCloseTrigger.setAttribute('href', 'javascript:void(0)');
			let remarkContent = document.createElement('div');
			remarkContent.className = 'remark-content';
			remarkContent.innerHTML = remark;
			remarkPopup.append(remarkContent);
			remarkPopup.append(remarkCloseTrigger);
			let parent = e.currentTarget.parentElement;


			// Открытие
			parent.append(remarkPopup);
			setTimeout(() => {
				remarkPopup.classList.add('open');
			})
		}
	}

	/**
	 * Открытие модального окна с видео
	 */
	openVideoModal(e:JQuery.ClickEvent){
		e.preventDefault();
		let src = $(e.currentTarget).attr('data-video');
		
		let dom = mustache.render(videocard_tpl, this.selectedCase);
		$('body').append(dom);

		setTimeout(() => {
			$('#video-modal').addClass('open');
			let video = <HTMLVideoElement>document.querySelector('#video-modal video');
			video.setAttribute('src', src);
			video.play();
		}, 200);
	}

	// Закрытие модального окна по нажатию Escape
	closeCardEsc(e:JQuery.KeyUpEvent){
		if(e.key == "Escape"){
			this.closeCard();
		}
	}

	/**
	 * Переключение формы образования в модальном окне
	 */
	switchModalForm(e:JQuery.ClickEvent){
		e.preventDefault();
		let el = <HTMLElement>e.currentTarget;
		let formName = el.textContent;

		let level:IEducationLevel = this.selectedCase.Education_levels?.filter((l:IEducationLevel) => {
			return l.Name = this.selectedCase.SelectedLevel?.Name;
		})[0];

		if(!level.Forms){
			console.error(level);
			return null;
		}
		let form:IEducationForm = level.Forms.filter((f:IEducationForm) => {
			return f.Name == formName;
		})[0];

		let output = mustache.render(dataTpl, form);
		this.selectedCase.SelectedForm = form;

		$('.form-switcher a').removeClass('selected');
		$(el).addClass('selected');

		$('.speciality-data-wrapper').html(output);
	}

	/**
	 * Закрытие модального окна при клике мимо
	 */
	closeOutside(e:JQuery.ClickEvent){
		let path = Array.from(e.originalEvent?.composedPath());
		let filteredNodes = path.filter((el:HTMLElement) => {
			if(el.classList){
				return el.classList.contains("faculty-modal");
			}
		})
		if(!filteredNodes.length){
			e.preventDefault();
			this.closeCard();
		}
	}

	/**
	 * Фильтрация по уровню (Бакалавриат/Специалитет/Магистратура)
	 */
	filterByLevel(e:JQuery.ChangeEvent):void{
		let input = <HTMLInputElement>e.currentTarget;
		let tab = input.parentElement;
		if(tab?.classList.contains('disabled'))
			return null;
		$('.calculator-head .pseudo-tab').removeClass('active');
		tab?.classList.add('active');
		this.filterParams.level = e.currentTarget.value;
		let filteredData = this.filter(this.cards_data);
		document.querySelector('.calculator-app')?.setAttribute('data-level', e.currentTarget.value);
		document.querySelector('.filters')?.setAttribute('data-level', e.currentTarget.value);
		this.render(filteredData);
	}

	/**
	 * Фильтрация по тексту (быстрый поиск)
	 */
	filterByText(e:Event):void{
		let el = <HTMLInputElement>e.currentTarget;
		this.filterParams.quickSearch = el.value;
		const filteredData = this.filter(this.cards_data);
		this.render(filteredData);
		if(el.value != ""){
			$('.section-wrapper').show();
		}
	}

	/**
	 * Применение фильтров к данным
	 * @param data {IData} Данные
	 * @returns {IData} Отфильтрованные данные
	 */
	filter(data:IData):IData{

		// Уровень образования
		let outputArray = data.Elements.filter((el:ICardData) => {
		
			if(el.Education_levels){

				return el.Education_levels.filter((level:IEducationLevel) => {
					if(this.filterParams.level == "Бакалавриат/специалитет"){
						return level.Name == "Бакалавриат" || level.Name == "Специалитет";
					}else{
						return level.Name == this.filterParams.level
					}
				}).length > 0;
			}
		})

		// Быстрый поиск
		if(this.filterParams.quickSearch != ""){
			
			outputArray = outputArray.filter((el:ICardData) => {

				let needleS = (el.Speciality || "").toLowerCase();
				let needleF = el.Faculty.Name.toLowerCase();
				let needleP = (el.Profile || "").toLowerCase();
				let search = this.filterParams.quickSearch.toLowerCase().trim();

				return needleS.indexOf(search) >= 0  || needleF.indexOf(search) >= 0 || needleP.indexOf(search) >= 0 ;
			})
		}

		// Требования
		if(this.filterParams.level == "Бакалавриат" || this.filterParams.level == 'Специалитет' || this.filterParams.level=="Бакалавриат/специалитет"){

			if(this.filterParams.Requirements.length >= 3){

				// Первый проход (обязательные предметы)
				let necessary = outputArray.filter((el:ICardData) => {
					
					let necArray = el.Requirements?.filter((r:IRequirement) => {
						return r.Classname === 'required';
					})
		
					let necStrArray = necArray?.map((r:IRequirement) => {
						return r.Name
					});
		
					let necIntersect = this.filterParams.Requirements.filter(val => necStrArray?.includes(val));
					return necIntersect.length >= 2
		
				});
		
				// Второй проход (необязательные предметы)
				let optional = necessary.filter((el:ICardData) => {
					let optArray = el.Requirements?.filter((r:IRequirement) => {
						return r.Classname === 'optional';
					});
		
					let optStrArray = optArray?.map((r:IRequirement) => {
						return r.Name;
					})
		
					let optIntersect = this.filterParams.Requirements.filter(val => optStrArray?.includes(val));
					return optIntersect.length >= 1;
				});
		
				outputArray = optional;
			}

		}

		// Сортировка массива перед выдачей
		(outputArray as any) = this.sort(outputArray);

		let output:IData = {
			Elements: outputArray
		}

		return output;
	}

	/**
	 * Сортировка объектов по параметру
	 * @param {string} property Параметр, по которому надлежит сортировать
	 * @returns {Array} Отсортированный массив
	 */
	sort(input:Array<ICardData>):Array<ICardData> | null{

		let sortedArray = [...input]; // Копия оригинального массива для изменений

		if(!sortedArray.length) return null;

		sortedArray.sort((a:ICardData, b:ICardData) => {

			// Вывод отладочной информации об ошибочных данных
			// console.log(a.id + ":" + b.id);

			const NameA = a.Faculty.Name.toLowerCase();
			const NameB = b.Faculty.Name.toLowerCase();

			if(NameA < NameB) return -1;
			if (NameA > NameB) return 1;

			return 0;
		})

		// Создание заголовка факультета для первого элемента
		let firstElementFaculty = sortedArray[0].Faculty;
		let newElement:ICardData = {
			Faculty: firstElementFaculty
		};

		sortedArray.unshift(newElement); // Добавляем заголовок в начало списка

		for(let i=1; i<sortedArray.length-1;i++){
			let nextCardData =  sortedArray[i+1];
			let currentCardData = sortedArray[i];

			if(nextCardData.Faculty != currentCardData.Faculty){
						
				let newElement:ICardData = {
					Faculty: nextCardData.Faculty
				}
		
				sortedArray = this.InsertArray(sortedArray, (i+1), newElement);
			}
		}

		return sortedArray;
	}

	/**
	 * Вставка в указанный индекс массива нового элемента
	 * @param {Array<ICardData>} arr Входной массив
	 * @param {number} index Индекс, куда поместить новый элемент
	 * @param {ICardData} newElement Новый элемент
	 * @returns {Array<ICardData>} Массив со вставленным элементом
	 */
	InsertArray(arr:Array<ICardData>, index:number, newElement:ICardData):ICardData[]{
		let newArray =  [
			...arr.slice(0,index),
			newElement,
			...arr.slice(index)
		]
		return newArray;
	}

	/**
	 * Вывод данных с помощью Template-машины
	 * @param {IData} data Данные для генерации
	 */
	render(data:IData):void{
		
		let preparedData:IPreparedData = this.groupData(data);
		let output = mustache.render(template, preparedData);
		let educationForm = this.filterParams.level;

		this.outputContainer.innerHTML = output;

		document.querySelectorAll('.faculty-header').forEach((headerEl:Element) => {
			let header = <HTMLElement>headerEl;
			if(header.nextElementSibling?.className == 'faculty-header') header.remove();
		})

		document.querySelectorAll('.spec-card').forEach((cardEl:Element) => {

			let card = <HTMLElement>cardEl;
			if(!card) return;
			
			// Обновление кодов в карточке
			let id = parseInt(card.dataset['id'] || "0");

			if(id == 0) return;

			let cardData = this.cards_data.Elements.filter((c:ICardData) => {
				return c.Id == id
			})[0];
			if(cardData){

				let SelectedLevel = document.querySelector(".calculator-head .active")?.textContent?.trim();
	
				let level = cardData.Education_levels?.filter((l:IEducationLevel) => {
					if(SelectedLevel == "Бакалавриат/специалитет"){
						return l.Name == "Бакалавриат" || l.Name == "Специалитет";
					}else{
						return l.Name == SelectedLevel
					}
				})[0];
	
				if(!level) return;
				let code = level.Code;
				let freeVacations = level.Forms[0].Vacations.Free.Total;
				let paidVacations = level.Forms[0].Vacations.Paid.Total;
	
				let cardCode = card.querySelector('.code');
				if(cardCode) cardCode.textContent = code;
	
				document.querySelectorAll('.education-level').forEach((levelEl:Element) => {
	
					let level = <HTMLElement>levelEl;
	
					level.querySelectorAll('.education-form').forEach((formEl:Element) => {
	
						let form = <HTMLFormElement>formEl;
						form.classList.remove('active');
					});
					level.querySelector('.education-form:first-of-type')?.classList.add('active');
				})
	
				// Обновление данных по количеству мест
				let freeValue = card.querySelector('.number-free .number-value');
				let paidValue = card.querySelector('.number-paid .number-value');
	
				if(freeValue && paidValue){
					freeValue.textContent = (freeVacations == null ? 0 : freeVacations).toString();
					paidValue.textContent = (paidVacations == null ? 0 : paidVacations).toString();
				}
			}
		})
	}

	/**
	 * Клик по тегу (ЕГЭ)
	 */
	filterByTags(e:JQuery.ClickEvent):void{

		let el = <HTMLElement>e.currentTarget;
		let content = el.textContent;
		$(el).toggleClass('active');

		let selectedTags = document.querySelectorAll('label.active');
		this.filterParams.Requirements = [];
		selectedTags.forEach((tagEl:Element) => {
			let tag = <HTMLElement>tagEl;
			if(tag.textContent){
				(this.filterParams.Requirements as string[]).push(tag.textContent);
			}
		});

		let Classname = selectedTags.length >= 3 ? "bttn" : "bttn disabled";
		document.querySelector('#filter')?.setAttribute('class', Classname);
	}

	/**
	 * Запуск фильтрации
	 */
	runFilters(e:Event, fast:boolean = false):void{

		if(this.filterParams.Requirements.length > 0 && this.filterParams.Requirements.length < 3){
			alert("Пожалуйста, выберите не менее 3-х предметов!");
			return;
		}

		let filteredData = this.filter(this.cards_data);
		this.render(filteredData);

		if(!fast){
			$('.section-wrapper').slideDown();
			$('.requirements-wrapper').slideDown();
			$('.requirements-trigger').addClass('active');
			$('.faculty-header').addClass('active');
		}
	}

	/**
	 * Переключение типа образования в карточке
	 */
	switchFormType(e:JQuery.ClickEvent):void{
		let card = $(e.currentTarget).parents('.spec-card').get(0);
		if(!card) return;
		let id = parseInt(card?.dataset['id'] || "0");
		let SelectedForm = e.currentTarget.textContent;

		card?.querySelectorAll('.education-form').forEach((formEl:Element) => {
			let form = <HTMLElement>formEl;
			form.classList.remove("active");
		})

		e.currentTarget.classList.add('active');
		
		let entry = this.cards_data.Elements.filter((el:ICardData) => {
			return el.Id == id
		})[0];

		if(!entry) return;

		// Получаем уровень
		let level:IEducationLevel | null = null;
		if(entry.Education_levels){
			level = entry.Education_levels.filter((level:IEducationLevel) => {
				if(this.filterParams.level == "Бакалавриат/специалитет"){
					return level.Name == "Бакалавриат" || level.Name == "Специалитет";
				}else{
					return level.Name == this.filterParams.level;
				}
			})[0];
		}

		if(!level) return;

		// Получаем форму обучения
		let form:IEducationForm = level.Forms.filter((f:IEducationForm) => {
			return f.Name == SelectedForm;
		})[0];

		let numberFree = card.querySelector('.number-free .number-value');
		let numberPaid = card.querySelector('.number-paid .number-value');
		let duration = card.querySelector('.number-duration .number-value');
		let price = card.querySelector('.number-cost .number-value');

		if(!numberFree || !numberPaid || !duration) return;

		numberFree.textContent = (form.Vacations.Free.Total || 0).toString();
		numberPaid.textContent = (form.Vacations.Paid.Total || 0).toString();
		duration.textContent = (form.Duration || 0).toString();

		if(!form.Remark){
			price.textContent = form.Price.toString() + " ₽/год";
		}else{
			let priceLink = document.createElement('a');
			priceLink.href = 'javascript:void(0)';
			priceLink.textContent = form.Price.toString() + " ₽/год";
			
			let pricelinkInfoIcon = document.createElement('i');
			pricelinkInfoIcon.classList.add('bx', 'bxs-info-circle');
			priceLink.append(pricelinkInfoIcon);
			
			priceLink.dataset['remark'] = form.Remark;
			price.innerHTML = "";
			price?.append(priceLink);
		}
		
	}

	/**
	 * Сброс фильтров
	 */
	resetFilters(){
		this.filterParams.Requirements = [];
		document.querySelectorAll('.tags label').forEach(el => {
			el.classList.remove('active');
		})
		this.runFilters(null, true);
	}

	/**
	 * Переключение отображения факультета
	 */
	toggleFaculty(e:JQuery.ClickEvent){
		let fheader = $(e.currentTarget);
		let sectionCards = fheader.next();

		let already = sectionCards.is(':visible');
		let Classname = already ? "faculty-header" : "faculty-header active";
		fheader[0].className = Classname;

		sectionCards.slideToggle({
			duration: 'fast'
		});
	}

	/**
	 * Подготовка данных к передаче шаблонизатору
	 * @param {IData} data Данные для упорядочивания
	 * @returns {IPreparedData} Подготовленные данные
	 */
	groupData(data:IData):IPreparedData{

		let elements:ICardData[] = data.Elements;

		if(!elements) return {
			Sections: []
		};

		let sections = elements.filter((el:ICardData) => {
			return el.Id == null;
		});

		let sectionIndex = 0;
		let preparedData:IPreparedData = {
			Sections: []
		};
		
		let section:ISection = {
			Name: "",
			CardsAmount: 0,
			CardsUnits: "",
			SectionContent: []
		};

		data.Elements.forEach((card:ICardData) => {

			if(card.Requirements){
				if(card.Requirements.length > 0 && card.SelectedFormName != "Магистратура"){
					card.RequirementsExists = true
				}else{
					card.RequirementsExists = false
				}
			}

			let formName = this.filterParams.level == "Бакалавриат/специалитет" ?  card.Education_levels?.filter((l:IEducationLevel) => {
				return l.Name == "Бакалавриат" || l.Name == "Специалитет";
			})[0].Name : this.filterParams.level;

			card.SelectedFormName = formName;

			let SelectedLevel:IEducationLevel = card.Education_levels?.filter((l:IEducationLevel) => {
				return l.Name == card.SelectedFormName;
			})[0];

			card.SelectedLevel = SelectedLevel;

			if(card.SelectedLevel){

				if(card.SelectedLevel.Details){

					if(SelectedLevel.Details.About == "" || SelectedLevel.Details.About == null){
						card.NoDetails = true
					}else{
						card.NoDetails = false
					}
				}else{
					card.NoDetails = true
				}
			}


			if(card.Id == null){
				if(section.Name == ""){
					section = {
						Name: card.Faculty.Name,
						CardsAmount: 0,
						CardsUnits: "",
						SectionContent: []
					}
				}else{
					if(section.Name != card.Faculty.Name){
						section.CardsUnits = this.num_word(section.CardsAmount, ["направление", "направления", "направлений"]);
						preparedData.Sections.push(section);
						section = {
							Name: card.Faculty.Name,
							CardsAmount: 0,
							CardsUnits: "",
							SectionContent: []
						}
					}
				}
			}else{
				let necessary = card.Requirements?.filter((r:IRequirement) => {
					return r.Classname == "required";
				})
				let optional = card.Requirements?.filter((r:IRequirement) => {
					return r.Classname == "optional";
				})
				card.Necessary = necessary;
				card.Optional = optional;
				section.SectionContent.push(card);
				section.CardsAmount++;
			}
		});

		// if(preparedData.sections.length == 0 && section.sectionContent.length > 0){
			section.CardsUnits = this.num_word(section.CardsAmount, ["направление", "направления", "направлений"]);
			preparedData.Sections.push(section);
		// }

		return preparedData;

	}

	/**
	 * Открытие карточки с описанием факультета
	 */
	openCard(e:JQuery.ClickEvent, URLParams:IURLCardData = null, historyCase:ICardData = null){

		// let selectedCase:ICardData;
		let card:HTMLElement;
		
		if(!URLParams){
			
			if(!historyCase){

				card = e.currentTarget;
				e.preventDefault();
			
				// Прерываем выполнение если клик происходит по интерактивному элементу внутри карточки
				let path = Array.from(e.originalEvent?.composedPath());
				let links = path.filter((el:HTMLElement) => {
					if(el.classList){
						return el.classList.contains('remark-popup') || el.tagName == 'A';
					}else{
						return el.tagName == "A";
					}
				});
			
				if(links.length) return;
	
				// Закрываем remark-popup если он был открыт
				let remarkPopup = <HTMLElement>card.querySelector('.remark-popup');
				if(remarkPopup){
					remarkPopup.classList.remove('open');
					setTimeout(() => {
						remarkPopup.remove();
					}, 500);
				}
			
				// Если клик по карточке не происходит по интерактивным элементам, продолжаем…
				let id = parseInt(card.dataset['id']);
			
				this.selectedCase = this.cards_data.Elements.filter((card:ICardData) => {
					return card.Id == id;
				})[0];
	
				// Если у карточки присутствует поле внешней ссылки, вместо открытия модалки открываем её
			
				// let externalLink = this.selectedCase.externalLink;
				// if(externalLink != null && externalLink != ""){
				// 	// Открываем окно и прерываем выполнение
				// 	window.open(externalLink, "_blank");
				// 	return null;
				// }
			}else{
				this.selectedCase = historyCase;
			}

		}else{
			this.selectedCase = this.cards_data.Elements.filter((card:ICardData) => {
				return card.Id == URLParams.Id;
			})[0];

			// Прокручиваем до секции карточек и открываем её
			history.scrollRestoration = 'manual';
			let Faculty = this.selectedCase.Faculty.Name;

			let element = $(`[data-faculty='${Faculty}']`);
			let top = element.offset().top;
			let content = element.next();
			content.show();
			document.documentElement.scrollTop = top;
		}

		// Выбранный уровень образования
		if(!historyCase){
			if(!URLParams){
				this.selectedCase.SelectedLevel = this.selectedCase.Education_levels.filter((l:IEducationLevel) => {
					if(this.filterParams.level == "Бакалавриат/специалитет"){
						return l.Name == "Бакалавриат" || l.Name == "Специалитет"
					}else{
						return l.Name === this.filterParams.level;
					}
				})[0];
			}else{
				this.selectedCase.SelectedLevel = this.selectedCase.Education_levels?.filter((l:IEducationLevel) => {
					return l.Name == URLParams.Level;
				})[0];
			}
		}

		// Если форма обучения - магистратура, прерываем выполнения (ждём описания)
		// TODO Убрать ограничения, когда получим данные
		if(this.selectedCase.NoDetails){
			return null;
		}

		// Выбранная форма обучения
		if(!historyCase){

			if(!URLParams){
				let formEl = <HTMLElement>card.querySelector('.education-form.active');
				let formText = formEl.textContent;
				this.selectedCase.SelectedForm = this.selectedCase.SelectedLevel.Forms.filter((f:IEducationForm) => {
					return f.Name == formText;
				})[0];
			}else{
				this.selectedCase.SelectedForm = this.selectedCase.SelectedLevel?.Forms.filter((f:IEducationForm) => {
					return f.Name == URLParams.Form
				})[0];
			}

			// Формирование данных для переключателя
			this.selectedCase.Switcher = [];
			this.selectedCase.SelectedLevel.Forms.forEach((f:IEducationForm) => {
				let Classname = f.Name == this.selectedCase.SelectedForm.Name ? "selected" : "";
				this.selectedCase.Switcher?.push({
					Name: f.Name,
					Classname: Classname
				});
			})
		}


		let dom = mustache.render(fullcard_tpl, this.selectedCase);

		history.pushState({
			modalState: 'open',
			selectedCase: this.selectedCase
		}, null);

		$('body').append(dom);

		setTimeout(() => {
			$('.faculty-modal-wrapper').addClass('open');
		}, 200);
	}

	/**
	 * Закрытие каоточки с описанием факультета
	 */
	closeCard(){
		$('.faculty-modal-wrapper:last-of-type').removeClass('open');
		let video = <HTMLVideoElement>document.querySelector('#video-modal video');
		video?.pause();
		setTimeout(() => {
			$('.faculty-modal-wrapper:last-of-type').remove();
		}, 600);
	}

	/**
	 * Формирование ссылки на модальное окно
	 */
	async shareModal(){
		let search_params = new URLSearchParams();
		search_params.set("id", this.selectedCase.Id?.toString())
		search_params.set("level", this.selectedCase.SelectedLevel?.Name);
		search_params.set("form", this.selectedCase.SelectedForm.Name);
		
		let url = window.location.origin + "?" + search_params.toString();

		if(navigator.clipboard && window.isSecureContext){
			await navigator.clipboard.writeText(url).then(() => {
				navigator.clipboard.writeText(url);
				M.toast({html: "Ссылка скопирована в буфер обмена!"});
			})
		}else{
			let input = document.createElement('input');
			try{
				input.value = url;
				document.documentElement.append(input);
				input.select();
				document.execCommand('copy');
			}catch{
				M.toast({html: "Настройки браузера не позволяют скопировать текст в буфер обмена!"});
			}finally{
				input.remove();
				M.toast({html: "Ссылка скопирована в буфер обмена!"});
			}

		}
	}

	num_word(value:number, words:Array<string>):string{
		value = Math.abs(value) % 100; 
		var num = value % 10;
		if(value > 10 && value < 20) return words[2]; 
		if(num > 1 && num < 5) return words[1];
		if(num == 1) return words[0]; 
		return words[2];
	}
}

export default Calculator;