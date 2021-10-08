import crypto from "crypto";
import { hashIterations, hashKeyLenght } from "../utils/constants";

interface IGenerateHash {
	hash: string;
	salt: string;
}

export const generateHash = (password: string): IGenerateHash => {
	const salt = crypto.randomBytes(128).toString("base64");
	const hash = crypto.pbkdf2Sync(password, salt, hashIterations, hashKeyLenght, "sha512").toString("base64");
	return { hash, salt };
};

export const isUserPasswordValid = (password: string, savedHash: string, savedSalt: string): boolean => {
	return (
		savedHash == crypto.pbkdf2Sync(password, savedSalt, hashIterations, hashKeyLenght, "sha512").toString("base64")
	);
};
