let dataTpl = `
<div class="speciality-data">
	{{#Vacations.Free}}
	<div class="title">Бюджетные места</div>
	<div class="value"><span id="selected-free-total">{{Total}}</span></div>
	<div class="encoding-wrapper">
		{{#Main}}
		<div class="encoding">
			<div class="encoding-name">Основные места</div>
			<div class="encoding-value"><span id="selected-free-main">{{Main}}</span></div>
		</div>
		{{/Main}}
		{{#Target}}
		<div class="encoding">
			<div class="encoding-name">Целевая квота</div>
			<div class="encoding-value"><span id="selected-free-target">{{Target}}</span></div>
		</div>
		{{/Target}}
		{{#Particular}}
		<div class="encoding">
			<div class="encoding-name">Отдельная квота</div>
			<div class="encoding-value"><span id="selected-free-particular">{{Particular}}</span></div>
		</div>
		{{/Particular}}
		{{#Special}}
		<div class="encoding">
			<div class="encoding-name">Особая квота</div>
			<div class="encoding-value"><span id="selected-free-special">{{Special}}</span></div>
		</div>
		{{/Special}}
	</div>
	{{/Vacations.Free}}
</div>
<div class="speciality-data">
	<div class="title">Места по договорам</div>
	<div class="value"><span id="selected-paid-total">{{Vacations.Paid.Total}}</span></div>
	<div class="encoding-wrapper">
		{{#Vacations.Paid}}
		{{#Main}}
		<div class="encoding">
			<div class="encoding-name">Основные места</div>
			<div class="encoding-value"><span id="selected-paid-main">{{Main}}</span></div>
		</div>
		{{/Main}}
		{{#Foreign}}
		<div class="encoding">
			<div class="encoding-name">Для иностранных граждан</div>
			<div class="encoding-value"><span id="selected-paid-foreign">{{Foreign}}</span></div>
		</div>
		{{/Foreign}}
		{{/Vacations.Paid}}
	</div>
</div>
<div class="speciality-data">
	<div class="title">Продолжительность</div>
	<div class="value"><span id="selected-duration">{{Duration}}</span></div>
</div>
<div class="speciality-data">
	<div class="title">Стоимость договора</div>
	<div class="value">
		{{#Remark}}
		<a href="javascript:void(0);" data-remark="{{Remark}}">
			<span class="selected-price">{{Price}}</span> ₽/год
			<i class="bx bxs-info-circle"></i>
		</a>
		{{/Remark}}
		{{^Remark}}
		<span class="selected-price">{{Price}}</span> ₽/год
		{{/Remark}}
	</div>
</div>
`

export default dataTpl;