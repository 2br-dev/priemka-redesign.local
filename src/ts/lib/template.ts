let template = `
{{#Sections}}
<div class="faculty-header" data-faculty="{{Name}}">
	<h4>{{Name}}</h4>
	<div class="amount-wrapper">
		<div class="amount"><span class="amout">{{CardsAmount}}</span> <span class="units">{{CardsUnits}}</span></div>
		<div class="folder-arrow"></div>
	</div>
</div>
<div class="section-wrapper">
	<div class="section-content">
	{{#SectionContent}}
	<div class="spec-card-wrapper">
	{{#Label}}
	<div class="spec-card-label"><span>{{Label}}</span></div>
	{{/Label}}
	<div class="spec-card hoverable z-depth-1" data-id="{{Id}}" data-faculty="{{Faculty.Name}}" data-no-data="{{NoDetails}}" >
		<div class="card-content">
			<div class="card-top">
				<div class="selected-form">{{SelectedFormName}}</div>
				<div class="education-levels">
				{{#Education_levels}}
					<div data-level="{{Name}}" class="education-level">
						{{#Forms}}
						<a class="education-form">{{Name}}</a>
						{{/Forms}}
					</div>
				{{/Education_levels}}
				</div>
			</div>
			<div class="title"><h4 class="no-margin">{{Speciality}}</h4></div>
			<div class="subtitle"><span class="code">{{Education_levels.0.Code}}</span> {{Profile}}</div>
			<div class="numbers">
				<div class="number number-free">
					<div class="section-title">Бюджетныx</div>
					<div class="number-value">{{SelectedLevel.Forms.0.Vacations.Free.Total}}</div>
				</div>
				<div class="number number-paid">
					<div class="section-title">Платных</div>
					<div class="number-value">{{SelectedLevel.Forms.0.Vacations.Paid.Total}}</div>
				</div>
				<div class="number number-duration">
					<div class="section-title">Продолжительность</div>
					<div class="number-value">{{SelectedLevel.Forms.0.Duration}}</div>
				</div>
				<div class="number number-cost">
					<div class="section-title">Стоимость договора</div>
					<div class="number-value">
						{{#SelectedLevel.Forms.0.Remark}}
							<a href="javascript:void(0)" data-remark="{{SelectedLevel.Forms.0.Remark}}">
								{{SelectedLevel.Forms.0.Price}} ₽/год
								<i class="bx bxs-info-circle"></i>
							</a>
						{{/SelectedLevel.Forms.0.Remark}}
						{{^SelectedLevel.Forms.0.Remark}}
							{{SelectedLevel.Forms.0.Price}} ₽/год
						{{/SelectedLevel.Forms.0.Remark}}
					</div>
				</div>
			</div>
			<div class="Separator"></div>
			<div class="requirements-wrapper">
				<div class="requirements">
					<div class="requirement-header">Обязательные предметы</div>
					{{#Necessary}}
					<div class="requirement {{Classname}}">{{Name}} <span class="min">min<span class="hide-m-down"> баллов</span>: {{Min}}</span></div>
					{{/Necessary}}
					<div class="requirement-header">Дополнительные предметы</div>
					{{#Optional}}
					<div class="requirement {{Classname}}">{{Name}} <span class="min">min<span class="hide-m-down"> баллов</span>: {{Min}}</span></div>
					{{/Optional}}
				</div>
			</div>
			{{#Note}}
			<div class="note">
			{{.}}
			</div>
			{{/Note}}
			<div class="card-call2action" data-form-c2a="{{SelectedFormName}}">
				{{#RequirementsExists}}
				<a class="bttn-flat requirements-trigger" href="#!"><span class="hide-m-down">Результаты </span>ЕГЭ</a>
				{{/RequirementsExists}}
				<span class="bttn">Подробнее</span>
				{{#SelectedLevel.Video}}
				<a class="bttn video-trigger" href="#video" data-video="{{SelectedLevel.Video}}"><i class="bx bx-play" ></i><span>Видео</span></a>
				{{/SelectedLevel.Video}}
			</div>
		</div>
	</div>
	</div>
	{{/SectionContent}}
	</div>
</div>
{{/Sections}}
{{^Sections}}
<div class="nulltext">
	К сожалению, нет направлений, соответствующих выбранным вами параметрам
</div>
{{/Sections}}
`

export default template;