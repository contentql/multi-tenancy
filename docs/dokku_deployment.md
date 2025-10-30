# Dokku deployment

This guide explains how to deploy multi-tenancy app on your server using
[dokku](https://dokku.com/)

## Deployment process

1. Follow
   [official guide](https://dokku.com/docs/getting-started/installation/#1-install-dokku)
   install dokku on your server
2. Create a
   [app](https://dokku.com/docs/deployment/application-management/?h=app+man#application-management)

```bash
dokku apps:create <app-name>
```

- Add email-address for SSL certificate generation

```bash
dokku letsencrypt:set --global email john-doe@gmail.com
```

- Add a primary
  [domain](https://dokku.com/docs/configuration/domains/?h=doma#domain-configuration)
  to app

```bash
dokku domains:add <app-name> multi-tenancy.com
```

- Add
  [environment variables](https://dokku.com/docs/configuration/environment-variables/?h=envi#environment-variables)

```bash
# you can add all your environment variables in sequence at end
dokku config:set --no-restart <app-name> NEXT_PUBLIC_WEBSITE_URL="" PAYLOAD_URL="" DATABASE_URI="" PAYLOAD_URL="" S3_ENDPOINT="" S3_ACCESS_KEY_ID="" S3_SECRET_ACCESS_KEY=""
```

- Connect your github repository (you can skip this step for
  public-repositories)

```bash
# run this command -> dokku git:auth <host> <git-username> <pesonal-access-token>
# example if your repository looks like this -> https://github.com/john-doe/multi-tenancy.git
dokku git:auth github.com john-deo <pesonal-access-token>
```

- Clone and deploy repository

```bash
# run this command -> dokku git:sync [--build|build-if-changes] <app> <repository> [<git-ref>]
dokku git:sync --build <app-name> https://github.com/john-doe/multi-tenancy.git main
```

- Enable
  [SSL](https://github.com/dokku/dokku-letsencrypt?tab=readme-ov-file#commands)
  for application

```bash
dokku letsencrypt:enable <app-name>
```

## Tenant domains

- A domain should be attached to your app example:`multi-tenancy.com`
- Create a tenant from payload admin-panel example:`tenant-1`
- We need to add domain and generate SSL to app

```bash
dokku domains:add <app-name> tenant-1.multi-tenancy.com
dokku letsencrypt:enable <app-name>
```

**Root level domain (tenant-1.com)**

- Add this record in your domain provider

```
CNAME @ tenant-1.multi-tenancy.com auto proxy:off
```

- Add the domain and generate SSL to app

```bash
dokku domains:add <app-name> tenant-1.com
dokku letsencrypt:enable <app-name>
```

**Sub-domain (site.tenant-1.com)**

- Add this record in your domain provider

```
CNAME site tenant-1.multi-tenancy.com auto proxy:off
```

- Add the domain and generate SSL to app

```bash
dokku domains:add <app-name> site.tenant-1.com
dokku letsencrypt:enable <app-name>
```
