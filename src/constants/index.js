export const ROLES = {
	user: "company_user",
	admin: "company_admin"
}

export const INPUT_TYPES = {
	text: "text",
	longtext: "longtext",
	image: "image",
	select: "select",
	email: "email",
	password: "password",
	userStatus: "userStatus"
}

export const SORT = [
	{
		id: "createdAt",
		attributes: {
			name: "Created at"
		}
	},
	{
		id: "updatedAt",
		attributes: {
			name: "Updated at"
		}
	},
	{
		id: "publishedAt",
		attributes: {
			name: "Published at"
		}
	},
]

export const ORDER = [
	{
		id: "asc",
		attributes: {
			name: "asc"
		}
	},
	{
		id: "desc",
		attributes: {
			name: "desc"
		}
	},
]

export const ROLE_SELECT = [
	{id: "company_user", attributes: {name: "User"}},
	{id: "company_admin", attributes: {name: "Admin"}},
]

export const COMPANIES_ANNEX = [
	{id: "-1", attributes: {name: "Select a company"}},
	{id: "0", attributes: {name: "Create a new company"}},
]

export const STATUS = [
	{id: "pending", attributes: {name: "pending"}},
	{id: "published", attributes: {name: "published"}}
]
