export interface UserInfo {
	id: string;
	firstName: string;
	lastName: string;
	createdBy: string;
	updatedBy: string;
	updatedAt: string;
	isAdmin: boolean;
	englishLevel: EnglishLevel;
	technicalSkills: string;
	cvLink: string;
}

export enum EnglishLevel {
	BASIC = "Basic",
	INTERMEDIATE = "Intermediate",
	ADVANCED = "Advanced"
}
