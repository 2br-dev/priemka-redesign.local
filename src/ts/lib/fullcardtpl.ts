let fullcard_tpl = `
<div class="faculty-modal-wrapper">
	<div class="faculty-modal">
		<div class="faculty-modal-header" style="background-image:url(/lpk-2025/img/faculty_media/wallpapers/{{SelectedLevel.Details.Image}})">
			<div class="label">{{SelectedLevel.Name}}</div>
			<div class="header-info">
				<div class="info-top">
					<div class="speciality">
						{{SelectedLevel.Code}} {{profile}}
					</div>
					<div class="faculty">
						{{Faculty.Name}}
					</div>
				</div>
				<div class="info-bottom">
					{{Speciality}}
				</div>
			</div>
			<button class="faculty-modal-close bx bx-x"></button>
		</div>
		<div class="faculty-modal-body">
			<div class="content-wrapper">
				<div class="speciality">
					<p class="modal-section-header">О направлении</p>
					<ul class="form-switcher">
						{{#Switcher}}
						<li><a href="javascript:void(0);" class="{{Classname}}">{{Name}}</a></li>
						{{/Switcher}}
					</ul>
					<div class="speciality-data-wrapper">
						<div class="speciality-data">
							<div class="title">Бюджетные места</div>
							<div class="value"><span id="selected-free-total">{{SelectedForm.Vacations.Free.Total}}</span></div>
							<div class="encoding-wrapper">
								{{#SelectedForm.Vacations.Free.Main}}
								<div class="encoding">
									<div class="encoding-name">Основные места</div>
									<div class="encoding-value"><span id="selected-free-Main">{{SelectedForm.Vacations.Free.Main}}</span></div>
								</div>
								{{/SelectedForm.Vacations.Free.Main}}
								{{#SelectedForm.Vacations.Free.Target}}
								<div class="encoding">
									<div class="encoding-name">Целевая квота</div>
									<div class="encoding-value"><span id="selected-free-target">{{SelectedForm.Vacations.Free.Target}}</span></div>
								</div>
								{{/SelectedForm.Vacations.Free.Target}}
								{{#SelectedForm.Vacations.Free.Particular}}
								<div class="encoding">
									<div class="encoding-name">Отдельная квота</div>
									<div class="encoding-value"><span id="selected-free-particular">{{SelectedForm.Vacations.Free.Particular}}</span></div>
								</div>
								{{/SelectedForm.Vacations.Free.Particular}}
								{{#SelectedForm.Vacations.Free.Special}}
								<div class="encoding">
									<div class="encoding-name">Особая квота</div>
									<div class="encoding-value"><span id="selected-free-special">{{SelectedForm.Vacations.Free.Special}}</span></div>
								</div>
								{{/SelectedForm.Vacations.Free.Special}}
							</div>
						</div>
						<div class="speciality-data">
							<div class="title">Места по договорам</div>
							<div class="value"><span id="selected-paid-total">{{SelectedForm.Vacations.Paid.Total}}</span></div>
							<div class="encoding-wrapper">
								{{#SelectedForm.Vacations.Paid.Main}}
								<div class="encoding">
									<div class="encoding-name">Основные места</div>
									<div class="encoding-value"><span id="selected-paid-Main">{{SelectedForm.Vacations.Paid.Main}}</span></div>
								</div>
								{{/SelectedForm.Vacations.Paid.Main}}
								{{#SelectedForm.Vacations.Paid.Foreign}}
								<div class="encoding">
									<div class="encoding-name">Для иностранных граждан</div>
									<div class="encoding-value"><span id="selected-paid-foreign">{{SelectedForm.Vacations.Paid.Foreign}}</span></div>
								</div>
								{{/SelectedForm.Vacations.Paid.Foreign}}
							</div>
						</div>
						<div class="speciality-data">
							<div class="title">Продолжительность</div>
							<div class="value"><span id="selected-duration">{{SelectedForm.Duration}}</span></div>
						</div>
						<div class="speciality-data">
							<div class="title">Стоимость договора</div>
							<div class="value"><span class="selected-price">
								{{#SelectedForm.Remark}}
								<a href="javascript:void(0);" data-remark="{{SelectedForm.Remark}}">
									<span>{{SelectedForm.price}}</span> ₽/год</span>
									<i class="bx bxs-info-circle"></i>
								</a>
								{{/SelectedForm.Remark}}
								{{^SelectedForm.Remark}}
								{{SelectedForm.Price}}</span> ₽/год
								{{/SelectedForm.Remark}}
							</div>
						</div>
					</div>
					<div class="speciality-info">
						{{#Note}}
						<small>{{Note}}</small>
						{{/Note}}
					</div>
					<div class="speciality-info">
						<div>
						{{{SelectedLevel.Details.About}}}
						{{#SelectedLevel.Video}}
						<a class="bttn video-trigger" href="#video" data-video="{{SelectedLevel.Video}}"><i class="bx bx-play" ></i>Смотреть видео</a>
						{{/SelectedLevel.Video}}
						</div>
					</div>
				</div>
				<div class="faculty">
					<p class="modal-section-header">О факультете</p>
					<div class="head-info-wrapper">
						<div class="head-image">
							<img src="/lpk-2025/img/faculty_media/decans/{{Extra.Head.Photo}}">
						</div>
						<div class="head-data">
							<p>{{Extra.Head.rank}}</p>
							<p class="name">{{Extra.Head.Last_name}} {{Extra.Head.First_name}} {{Extra.Head.Middle_name}}</p>
							<p class="regalia">{{Extra.Head.Regalia}}</p>
						</div>
					</div>
					<div class="faculty-info">
						{{{Faculty.About}}}
					</div>
				</div>
			</div>
		</div>
		<div class="faculty-modal-footer">
			<div class="social">
				<p class="section-header">Больше о факультете</p>
				<p>
				{{#Extra.networks}}
				<a target="_blank" rel="nofollow" class="social-icon {{icon}}" href="{{link}}"></a>
				{{/Extra.networks}}
				</p>
			</div>
			<div class="contacts">
				<p class="section-header">Контакты приёмной комиссии</p>
				<div class="contacts-wrapper">
					<div class="contacts-block">
						<div class="contacts-title">«Горячая линия» по вопросам поступления</div>
						<div class="contacts-link">
							<a href="tel:+78612215881"><i class="bx bxs-phone"></i><span>+7 (861) 221-58-81</span></a>
						</div>
					</div>
					<div class="contacts-block">
						<div class="contacts-title">Отдел по работе с абитуриентами</div>
						<div class="contacts-link">
							<a href="tel:+78612215818"><i class="bx bxs-phone"></i><span>+7 (861) 221-58-18</span></a>
						</div>
					</div>
					<div class="contacts-block">
						<div class="contacts-title">Электронная почта приёмной комиссии</div>
						<div class="contacts-link">
							<a href="mailto:pk@kubsau.ru"><i class="bx bxs-envelope-open"></i><span>pk@kubsau.ru</span></a>
						</div>
					</div>
				</div>
			</div>
			<div class="share">
				<a class="share-link" href="javascript:void(0);" id="share"><i class="bx bx-share-alt"></i></a>
			</div>
		</div>
	</div>
</div>
`;

export default fullcard_tpl;