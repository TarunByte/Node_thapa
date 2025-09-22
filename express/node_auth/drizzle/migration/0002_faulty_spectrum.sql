ALTER TABLE `short_link` ADD `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;-->statement-breakpoint
ALTER TABLE `short_link` ADD `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `short_link` ADD CONSTRAINT `short_link_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;