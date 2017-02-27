namespace YoutubeControl.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DbMigrationsConfigurationAutomaticMigrationsEnabledtrue : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Videos", "vId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Videos", "vId");
        }
    }
}
