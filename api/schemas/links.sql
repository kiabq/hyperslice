-- Create 'links' table --
CREATE TABLE links (
	id serial4 NOT NULL,
	link varchar(2048) NOT NULL DEFAULT '',
	CONSTRAINT links_pkey PRIMARY KEY (id)
);