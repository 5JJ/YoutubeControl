namespace YoutubeControl.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ListBoxes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Videos",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        vLink = c.String(),
                        vthumb = c.String(),
                        vTitle = c.String(),
                        vNum = c.Int(nullable: false),
                        listNum = c.Int(nullable: false),
                        ListBoxId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ListBoxes", t => t.ListBoxId, cascadeDelete: true)
                .Index(t => t.ListBoxId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Videos", "ListBoxId", "dbo.ListBoxes");
            DropIndex("dbo.Videos", new[] { "ListBoxId" });
            DropTable("dbo.Videos");
            DropTable("dbo.ListBoxes");
        }
    }
}
