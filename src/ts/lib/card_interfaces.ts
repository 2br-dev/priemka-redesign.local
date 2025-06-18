export interface IEducationForm{
	Name: string,
	Duration: number,
	Price: number,
	Remark:string,
	Vacations: {
		Free: {
			Total: number,
			Main?: number,
			Target?: number,
			Particular?: number,
			Special?: number
		},
		Paid: {
			Total: number,
			Main?: number,
			Foreign?: number
		}
	}
}

export interface IRequirement{
	Name:string,
	Min: number,
	Classname: string
}

export interface IEducationLevel{
	Name: string,
	Code: string,
	Details?: {
		Image?: string,
		About?: string
	},
	Forms: Array<IEducationForm>
}

export interface IFormSwitcher{
	Name: string,
	Classname: string
}

export interface ICardData{
	Id?: number,
	Faculty: {
		Name: string,
		About: string
	}
	Profile?: string,
	Speciality?: string,
	NoDetails?: boolean | true,
	Education_levels?: Array<IEducationLevel>,
	Requirements?: Array<IRequirement>,
	RequirementsExists?: boolean,
	Necessary?:Array<IRequirement>,
	Optional?:Array<IRequirement>,
	Price?: number,
	SelectedLevel?:IEducationLevel,
	SelectedForm?:IEducationForm,
	SelectedFormName?:string,
	Switcher?: IFormSwitcher[],
	ExternalLink?: string
}

export interface IData{
	Elements:Array<ICardData>
}

export interface ISection{
	Name: string,
	CardsAmount: number,
	CardsUnits: string,
	SectionContent: ICardData[];
}

export interface IPreparedData{
	Sections: ISection[];
}

export interface IURLCardData{
	Id:number,
	Form:string,
	Level:string
}